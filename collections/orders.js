Orders = new Meteor.Collection('orders', {
  schema: new SimpleSchema({
    read: {
      type: Boolean
    },
    open: {
      type: Boolean
    },
    requestedAt: {
      type: Date
    },
    deviceId: {
      type: String
    },
    hotelId: {
      type: String
    },
    userId: {
      type: String
    },
    type: {
      type: String
    },
    confirmationDate: {
      type: Date,
      optional: true
    },
    status: {
      type: String,
      optional: true
    },
    cancelledDate: {
      type: Date,
      optional: true
    }
  })
});

// Allow/Deny

Orders.allow({
  insert: function(userId, doc){
    return userId;
  },
  update:  function(userId, doc, fieldNames, modifier){
    return userId === doc.userId;
  },
  remove:  function(userId, doc){
    return false;
  }
});

// Schemas

Schema.makeReservation = new SimpleSchema({
  partySize: {
    type: Number,
    label: 'Number of Guests',
    min: 1
  },
  partyName: {
    type: String,
    label: 'Full Name'
  },
  date: {
    type: String,
    label: "Date"
  },
  dateDatetime: {
    type: Date
  },
  time: {
    type: String,
    label: "Time"
  },
  timeMinutes: {
    type: Number
  },
  phoneNumber: {
    type: String,
    label: 'Phone Number (for confirmation)'
  },
  emailAddress: {
    type: String,
    regEx: SchemaRegEx.Email,
    label: "Email Address"
  },
  experienceId: {
    type: String
  }
});

Meteor.methods({
  makeReservation: function(reservation) {
    var experienceId = reservation.experienceId;
    var experience = Experiences.findOne(experienceId);
    if (!experience) {
      throw new Meteor.Error(403, 'Invalid Experience');
    }

    // get some validation rules from experience
    var schema = Schema.makeReservation._schema;
    if (experience.maxPartySize) {
      schema.partySize.max = experience.maxPartySize;
    }
    schema.experienceId = {
      type: String
    }
    var extendedReservationSchema = new SimpleSchema(schema);
    check(reservation, extendedReservationSchema);

    var user = Meteor.user();
    var deviceId = user.deviceId;
    var device = Devices.findOne(deviceId);
    if (!device) {
      throw new Meteor.Error(403, 'Not a proper device');
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(403, 'Not a valid hotel');
    }

    var order = {
      type: 'reservation',
      deviceId: device._id,
      hotelId: hotel._id,
      reservation: reservation,
      requestedAt: new Date(),
      read: false,
      open: true,
      status: 'pending',
      userId: user._id
    }

    var orderId = Orders.insert(order, {validate: false});

    this.unblock();

    if (Meteor.isClient) {
      App.track("Submit Reservation Request", {
        "Experience Title": experience.title,
        "Experience Id": experience._id,
        "Experience Lead": experience.lead,
        "Experience PhotoUrl": experience.photoUrl,
        "Experience Category": experience.category,
        "City": experience.city
      });
    }

    if (Meteor.isServer) {
      var url = stripTrailingSlash(Meteor.settings.apps.admin.url) + "/patron-order/{0}".format(orderId);

      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: "noreply@plusmoretablets.com",
        subject: "Device in {0} at {1} has requested a reservation.\n\n".format(device.location, hotel.name), 
        text: "Device in {0} at {1} has requested a reservation.\n\n".format(device.location, hotel.name) 
            + "Reservation Details:\n\n"
            + "For: {0}\n".format(experience.title)
            + "When: {0} - {1}\n".format(reservation.date, reservation.time)
            + "Name: {0}\n".format(reservation.partyName)
            + "Party Size: {0}\n".format(reservation.partySize)
            + "Phone #: {0}\n".format(reservation.phoneNumber)
            + "Email: {0}\n".format(reservation.emailAddress)
            + "\n"
            + "Venue Info\n\n"
            + "{0}\n".format(experience.venueName)
            + "{0}\n".format(experience.street)
            + "{0}, {1} {2}\n".format(experience.city, experience.state, experience.zip)
            + "{0}\n".format(experience.phone)
            + "\nTo respond to this request, click the link below\n\n"
            + url
      });
    }

    return order;
  },
  cancelReservation: function(orderId) {
    var order = Orders.findOne(orderId);
    if (!order) {
      throw new Meteor.Error(403, 'Not a valid order'); 
    }

    Orders.update(orderId, {$set: {open: false, status: 'cancelled', cancelledDate: new Date()}});

    this.unblock();

    if (Meteor.server) {
      var experience = Experiences.findOne(order.reservation.experienceId);
      var reservation = order.reservation;

      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: 'noreply@plusmoretablets.com',
        subject: 'Cancelled - Reservation for {0}'.format(experience.title),
        text: "Reservation for {0} has been cancelled.\n\n".format(experience.title)
            + "Reservation Details:\n"
            + "\tFor: {0}\n".format(experience.title)
            + "\tWhen: {0} - {1}\n".format(reservation.date, reservation.time)
            + "\tParty Name: {0}\n".format(reservation.partyName)
            + "\tParty Size: {0}\n".format(reservation.partySize)
            + "\tPhone #: {0}\n".format(reservation.phoneNumber)
            + "\tEmail: {0}\n".format(reservation.emailAddress)
            + "\nVenue Info"
            + "\n\t{0}".format(experience.venueName)
            + "\n\t{0}".format(experience.street)
            + "\n\t{0}, {1} {2}".format(experience.city, experience.state, experience.zip)
            + "\n\t{0}".format(experience.phone)
      });
    }
  }
});