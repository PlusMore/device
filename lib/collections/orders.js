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


Schema.request = new SimpleSchema({
  type: {
    type: String
  },
  for: {
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
  requestedAt: {
    type: Date
  },
  requestedZone: {
    type: Number
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
  },
  reservation: {
    type: Object,
    optional: true,
    blackbox: true
  },
  request: {
    type: Object,
    optional: true,
    blackbox: true
  },
  for: {
    type: String,
    optional: true
  }
});

Orders.attachSchema(Schema.Order);

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

    var stay = Stays.findOne(user.stayId);

    if (stay) {
      var deviceId = stay.deviceId;
      var device = Devices.findOne(deviceId);
      var hotel = Hotels.findOne(device.hotelId);
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
      requestedAt: new Date(),
      requestedZone: reservation.zone,
      open: true,
      status: 'pending',
      userId: user._id
    };

    if (stay) {
      order.stayId = stay._id;
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
        text: "Reservation Details:\n\n"+ 
              "For: {0}\n".format(experience.title)+ 
              "When: {0}\n".format(when)+ 
              "Name: {0}\n".format(reservation.partyName)+ 
              "Party Size: {0}\n".format(reservation.partySize)+ 
              "Email: {0}\n".format(reservation.emailAddress)+ 
              "\n"+ 
              "Venue Info\n\n"+ 
              "{0}\n".format(experience.venueName)+ 
              "{0} {1}\n".format(experience.geo.streetNumber, experience.geo.streetName)+ 
              "{0}, {1} {2}\n".format(experience.geo.city, experience.geo.state, experience.geo.zipcode)+ 
              "{0}\n".format(experience.phone)+ 
              "\nTo respond to this request, click the link below\n\n"+ 
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

    Orders.update(orderId, {$set: {open: false, status: 'cancelled', cancelledDate: new Date()}});

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
  requestService: function(request) {
    // Check that type is provided
    check(request.type, String);

    // add any validation to schema for specific request types
    var requestSchema = _.clone(Schema.request._schema);
    switch (request.type) {
      case 'transportation':
        var transportationSchema = new SimpleSchema({
          transportationType: {
            type: String
          }
        });
        requestSchema = _.extend(requestSchema, {
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
        requestSchema = _.extend(requestSchema, {
          options: {
            type: valetServicesSchema
          }
        });
        break;
      default: 
        throw new Meteor.Error(500, 'Request type is not configured', request);
    }

    check(request, new SimpleSchema(requestSchema));

    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    var stay = Stays.findOne(user.stayId);

    if (!stay) {
      throw new Meteor.Error(403, 'No current stay registered for user');
    }

    if (moment().zone(stay.zone) > moment(stay.checkoutDate).zone(stay.zone)) {
      throw new Meteor.Error(500, 'Stay has ended.');
    }

    var deviceId = stay.deviceId;
    var device = Devices.findOne(deviceId);
    if (!device) {
      throw new Meteor.Error(500, 'Not a proper device');
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(500, 'Not a valid hotel');
    }

    // valid request
    var stay = Stays.findOne({users: user._id});
    var order = {
      type: 'request',
      for: request.for,
      deviceId: device._id,
      hotelId: hotel._id,
      stayId: stay._id,
      request: request,
      requestedAt: new Date(),
      requestedZone: request.zone,
      open: true,
      status: 'pending',
      userId: user._id
    };

    var orderId = Orders.insert(order);

    this.unblock();

    if (Meteor.isServer) {
      var url = stripTrailingSlash(Meteor.settings.apps.admin.url) + "/patron-order/{0}".format(orderId);
      var when = moment(request.date).zone(request.zone);
      when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";

      var friendlyRequestType = HotelServices.friendlyRequestType(request.type);

      // for our information
      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: "noreply@plusmoretablets.com",
        subject: "Info: Device in {0} at {1} has requested hotel service.\n\n".format(device.location, hotel.name), 
        text: "This is an informational email and does not require your service\n\n" + 
              "Device in {0} at {1} has requested hotel service.\n\n".format(device.location, hotel.name)  + 
              "Request Details:\n\n" + 
              "For: {0}\n".format(friendlyRequestType) + 
              "When: {0}\n".format(when) + 
              "\nTo view the status of this request, click the link below\n\n" + 
              url
      });
    }

    return orderId;
  }, 
  cancelRequest: function(orderId) {
    var order = Orders.findOne(orderId);
    if (!order) {
      throw new Meteor.Error(403, 'Not a valid order'); 
    }

    Orders.update(orderId, {$set: {open: false, status: 'cancelled', cancelledDate: new Date()}});
  },
});