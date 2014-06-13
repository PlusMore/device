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
    min: 1
  },
  when: {
    type: String
  },
  date: {
    type: Date
  },
  experienceId: {
    type: String
  }
});

Meteor.methods({
  makeReservation: function(reservation) {
    check(reservation, Schema.makeReservation);

    var experienceId = reservation.experienceId;
    var experience = Experiences.findOne(experienceId);
    if (!experience) {
      throw new Meteor.Error(500, 'Invalid Experience');
    }

    var user = Meteor.user();
    var deviceId = user.deviceId;
    var device = Devices.findOne(deviceId);
    if (!device) {
      throw new Meteor.Error(500, 'Not a proper device');
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(500, 'Not a valid hotel');
    }

    var stay = Stays.findOne({userId: user._id});

    if (typeof user.emails !== 'undefined' 
        && typeof user.emails[0] !== 'undefined' 
        && typeof user.emails[0].address !== 'undefined') {
      reservation.emailAddress = user.emails[0].address;
    } else {
      throw new Meteor.Error(500, 'No email address');
    }
    
    if (typeof user.profile !== 'undefined' && typeof user.profile.name !== 'undefined') {
      reservation.partyName = user.profile.name;
    } else {
      throw new Meteor.Error(500, 'No party name');
    }

    var order = {
      type: 'reservation',
      deviceId: device._id,
      hotelId: hotel._id,
      stayId: stay._id,
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
        "Experience Category": experience.category,
        "Experience City": experience.city
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
            + "When: {0}\n".format(reservation.when)
            + "Name: {0}\n".format(reservation.partyName)
            + "Party Size: {0}\n".format(reservation.partySize)
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

    return orderId;
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
            + "Reservation Details:\n\n"
            + "For: {0}\n".format(experience.title)
            + "When: {0}\n".format(moment(reservation.date).calendar())
            + "Name: {0}\n".format(reservation.partyName)
            + "Party Size: {0}\n".format(reservation.partySize)
            + "Email: {0}\n".format(reservation.emailAddress)
            + "\nVenue Info\n"
            + "\n{0}".format(experience.venueName)
            + "\n{0}".format(experience.street)
            + "\n{0}, {1} {2}".format(experience.city, experience.state, experience.zip)
            + "\n{0}".format(experience.phone)
      });
    }
  }
});