Orders = new Meteor.Collection('orders');

// Schemas


Schema.makeReservation = new SimpleSchema({
  partySize: {
    type: Number,
    min: 1
  },
  date: {
    type: Date
  },
  zone: {
    type: Number
  },
  experienceId: {
    type: String
  }
});

Schema.bookNow = new SimpleSchema({
  partySize: {
    type: Number,
    min: 1
  },
  start: {
    type: Date
  },
  end: {
    type: Date
  },
  zone: {
    type: Number
  },
  experienceId: {
    type: String
  }
});

Schema.purchase = new SimpleSchema({
  type: {
    type: String
  },
  handledBy: {
    type: String
  },
  date: {
    type: Date
  },
  zone: {
    type: Number
  }
});

Schema.service = new SimpleSchema({
  type: {
    type: String
  },
  handledBy: {
    type: String
  },
  date: {
    type: Date
  },
  zone: {
    type: Number
  }
});

Schema.Order = new SimpleSchema({
  open: {
    type: Boolean
  },
  requestedDate: {
    type: Date
  },
  requestedZone: {
    type: Number
  },
  receivedDate: {
    type: Date,
    optional: true
  },
  receivedBy: {
    type: String,
    optional: true
  },
  completedDate: {
    type: Date,
    optional: true
  },
  completedBy: {
    type: String,
    optional: true
  },
  cancelledDate: {
    type: Date,
    optional: true
  },
  cancelledBy: {
    type: String,
    optional: true
  },
  deviceId: {
    type: String,
    optional: true
  },
  hotelId: {
    type: String,
    optional: true
  },
  stayId: {
    type: String,
    optional: true
  },
  roomId: {
    type: String,
    optional: true
  },
  userId: {
    type: String
  },
  type: {
    type: String
  },
  status: {
    type: String,
    optional: true
  },
  reservation: {
    type: Object,
    optional: true,
    blackbox: true
  },
  purchase: {
    type: Object,
    optional: true,
    blackbox: true
  },
  service: {
    type: Object,
    optional: true,
    blackbox: true
  },
  handledBy: {
    type: String,
  }
});

Orders.attachSchema(Schema.Order);

// Allow/Deny

Orders.allow({
  insert: function(userId, doc) {
    return userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return userId === doc.userId;
  },
  remove: function(userId, doc) {
    return false;
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
    if (!user) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    var stay = Stays.findOne({users: user._id, active: true});
    var room, hotel, device;

    if (stay) {
      room = Rooms.findOne(stay.roomId);

      if (room) {
        device = Devices.findOne({roomId: room._id});
      }

      hotel = Hotels.findOne(stay.hotelId);
    }

    if (typeof user.emails !== 'undefined' &&
      typeof user.emails[0] !== 'undefined' &&
      typeof user.emails[0].address !== 'undefined') {
      reservation.emailAddress = user.emails[0].address;
    } else {
      throw new Meteor.Error(500, 'No email address');
    }

    if (typeof user.profile !== 'undefined' && typeof user.profile.firstName !== 'undefined' && typeof user.profile.lastName !== 'undefined') {
      reservation.partyName = user.profile.firstName + " " + user.profile.lastName;
    } else {
      throw new Meteor.Error(500, 'No party name');
    }

    //valid request
    var order = {
      type: 'reservation',
      reservation: reservation,
      requestedDate: new Date(),
      requestedZone: reservation.zone,
      handledBy: 'plusmore',
      open: true,
      status: 'requested',
      userId: user._id
    };

    if (stay) {
      order.stayId = stay._id;
    }

    if (room) {
      order.roomId = room._id;
    }

    if (device) {
      order.deviceId = device._id;
    }

    if (hotel) {
      order.hotelId = hotel._id;
    }

    var orderId = Orders.insert(order);

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
      var when = moment(reservation.date).zone(reservation.zone);
      when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";

      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: "noreply@plusmoretablets.com",
        subject: "Reservation Request\n\n",
        text: "Reservation Details:\n\n" +
          "For: {0}\n".format(experience.title) +
          "When: {0}\n".format(when) +
          "Name: {0}\n".format(reservation.partyName) +
          "Party Size: {0}\n".format(reservation.partySize) +
          "Email: {0}\n".format(reservation.emailAddress) +
          "\n" +
          "Venue Info\n\n" +
          "{0}\n".format(experience.venueName) +
          "{0} {1}\n".format(experience.geo.streetNumber, experience.geo.streetName) +
          "{0}, {1} {2}\n".format(experience.geo.city, experience.geo.state, experience.geo.zipcode) +
          "{0}\n".format(experience.phone) +
          "\nTo respond to this request, click the link below\n\n" +
          url
      });
    }

    return orderId;
  },
  cancelReservation: function(orderId) {
    var order = Orders.findOne(orderId);
    if (!order) {
      throw new Meteor.Error(403, 'Not a valid order');
    }

    Orders.update(orderId, {
      $set: {
        open: false,
        status: 'cancelled',
        cancelledDate: new Date()
      }
    });

    this.unblock();

    if (Meteor.server) {
      var experience = Experiences.findOne(order.reservation.experienceId);
      var reservation = order.reservation;
      var when = moment(reservation.date).zone(reservation.zone);
      when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";

      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: 'noreply@plusmoretablets.com',
        subject: 'Cancelled - Reservation for {0}'.format(experience.title),
        text: "Reservation for {0} has been cancelled.\n\n".format(experience.title) +
          "Reservation Details:\n\n" +
          "For: {0}\n".format(experience.title) +
          "When: {0}\n".format(when) +
          "Name: {0}\n".format(reservation.partyName) +
          "Party Size: {0}\n".format(reservation.partySize) +
          "Email: {0}\n".format(reservation.emailAddress) +
          "\nVenue Info\n" +
          "\n{0}".format(experience.venueName) +
          "\n{0}".format(experience.street) +
          "\n{0}, {1} {2}".format(experience.city, experience.state, experience.zip) +
          "\n{0}".format(experience.phone)
      });
    }
  },
  requestService: function(service) {
    // Check that type is provided
    check(service.type, String);

    // add any validation to schema for specific request types
    var serviceSchema = _.clone(Schema.service._schema);
    switch (service.type) {
      case 'transportation':
        var transportationSchema = new SimpleSchema({
          transportationType: {
            type: String
          }
        });
        serviceSchema = _.extend(serviceSchema, {
          options: {
            type: transportationSchema
          }
        });
        break;
      case 'bellService':
        // Nothing extra needed for bellService
        break;
      case 'houseKeeping':
        // Nothing extra needed for houseKeeping
        break;
      case 'wakeUpCall':
        // Nothing extra needed for wakeUpCall
        break;
      case 'valetServices':
        var valetServicesSchema = new SimpleSchema({
          ticketNumber: {
            type: String
          }
        });
        serviceSchema = _.extend(serviceSchema, {
          options: {
            type: valetServicesSchema
          }
        });
        break;
      default:
        throw new Meteor.Error(500, 'Service type is not configured', service);
    }

    check(service, new SimpleSchema(serviceSchema));

    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    var stay = Stays.findOne({users: user._id});
    if (!stay) {
      throw new Meteor.Error(403, 'No current stay registered for user');
    }

    if (moment().zone(stay.zone) > moment(stay.checkoutDate).zone(stay.zone)) {
      throw new Meteor.Error(500, 'Stay has ended.');
    }

    var hotel = Hotels.findOne(stay.hotelId);
    if (!hotel) {
      throw new Meteor.Error(500, 'Not a valid hotel');
    }

    var room = Rooms.findOne(stay.roomId);
    if (!room) {
      throw new Meteor.Error(500, 'Not a valid room');
    }

    var device = Devices.findOne({roomId: room._id});

    // valid service
    var order = {
      type: 'service',
      handledBy: service.handledBy,
      deviceId: device && device._id || 'No Device',
      roomId: room._id,
      hotelId: hotel._id,
      stayId: stay._id,
      service: service,
      requestedDate: new Date(),
      requestedZone: service.zone,
      open: true,
      status: 'requested',
      userId: user._id
    };

    var orderId = Orders.insert(order);

    this.unblock();

    if (Meteor.isServer) {
      var url = stripTrailingSlash(Meteor.settings.apps.admin.url) + "/patron-order/{0}".format(orderId);
      var when = moment(service.date).zone(service.zone);
      when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";

      var friendlyServiceType = HotelServices.friendlyServiceType(service.type);

      // for our information
      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: "noreply@plusmoretablets.com",
        subject: "Info: Device in {0} at {1} has requested hotel service.\n\n".format(room.name, hotel.name),
        text: "This is an informational email and does not require your service\n\n" +
          "Device in {0} at {1} has requested hotel service.\n\n".format(room.name, hotel.name) +
          "Request Details:\n\n" +
          "For: {0}\n".format(friendlyServiceType) +
          "When: {0}\n".format(when) +
          "\nTo view the status of this request, click the link below\n\n" +
          url
      });
    }

    return orderId;
  },
  cancelService: function(orderId) {
    var order = Orders.findOne(orderId);
    if (!order) {
      throw new Meteor.Error(403, 'Not a valid order');
    }

    Orders.update(orderId, {
      $set: {
        open: false,
        status: 'cancelled',
        cancelledDate: new Date()
      }
    });
  },
});
