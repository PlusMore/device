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
    }
  })
});

// Allow/Deny

Orders.allow({
  insert: function(userId, doc){
    return false;
  },
  update:  function(userId, doc, fieldNames, modifier){
    return false;
  },
  remove:  function(userId, doc){
    return false;
  }
});

// Schemas

Schema.makeReservation = new SimpleSchema({
  partySize: {
    type: Number,
    label: 'How many people in your party?',
    min: 1
  },
  partyName: {
    type: String,
    label: 'Your Party\'s name'
  },
  date: {
    type: Date,
    label: "Date"
  },
  timeHour: {
    type: String,
    label: "Time"
  },
  timeMinute: {
    type: String
  },
  timePeriod: {
    type: String
  },
  phoneNumber: {
    type: String,
    label: 'Phone number (for confirmation)'
  },
  emailAddress: {
    type: String,
    regEx: SchemaRegEx.Email,
    label: "Email address"
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

    if (Meteor.isServer) {
      var url = stripTrailingSlash(Meteor.settings.apps.admin.url) + "/patron-order/{0}".format(orderId);
      var date = moment(reservation.date);
      var formattedDate = date.format("dddd, MMM Do YYYY");

      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: "noreply@plusmoretablets.com",
        subject: "Device in {0} at {1} has requested a reservation.\n\n".format(device.location, hotel.name), 
        text: "Device in {0} at {1} has requested a reservation.\n\n".format(device.location, hotel.name) 
            + "Reservation Details:\n"
            + "\tFor: {0}\n".format(experience.title)
            + "\tWhen: {0} at {1}:{2} {3}\n".format(formattedDate, reservation.timeHour, reservation.timeMinute, reservation.timePeriod)
            + "\tParty Name: {0}\n".format(reservation.partyName)
            + "\tParty Size: {0}\n".format(reservation.partySize)
            + "\tPhone #: {0}\n".format(reservation.phoneNumber)
            + "\tEmail: {0}\n".format(reservation.emailAddress)
            + "\nVenue Info"
            + "\n\t{0}".format(experience.venueName)
            + "\n\t{0}".format(experience.street)
            + "\n\t{0}, {1} {2}".format(experience.city, experience.state, experience.zip)
            + "\n\t{0}".format(experience.phone)
            + "\n\nTo respond to this request, click the link below\n\n"
            + url
      });
    }

    return orderId;
  }
});