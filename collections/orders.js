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

Schema.request = new SimpleSchema({
  type: {
    type: String
  },
  for: {
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

    if (typeof user.emails !== 'undefined' && 
        typeof user.emails[0] !== 'undefined' && 
        typeof user.emails[0].address !== 'undefined') {
      reservation.emailAddress = user.emails[0].address;
    } else {
      throw new Meteor.Error(500, 'No email address');
    }
    
    if (typeof user.profile !== 'undefined' && typeof user.profile.name !== 'undefined') {
      reservation.partyName = user.profile.name;
    } else {
      throw new Meteor.Error(500, 'No party name');
    }

    //valid request
    var stay = Stays.findOne({userId: user._id});
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
    };

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

      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: "noreply@plusmoretablets.com",
        subject: "Device in {0} at {1} has requested a reservation.\n\n".format(device.location, hotel.name), 
        text: "Device in {0} at {1} has requested a reservation.\n\n".format(device.location, hotel.name) + 
              "Reservation Details:\n\n"+ 
              "For: {0}\n".format(experience.title)+ 
              "When: {0}\n".format(reservation.when)+ 
              "Name: {0}\n".format(reservation.partyName)+ 
              "Party Size: {0}\n".format(reservation.partySize)+ 
              "Email: {0}\n".format(reservation.emailAddress)+ 
              "\n"+ 
              "Venue Info\n\n"+ 
              "{0}\n".format(experience.venueName)+ 
              "{0}\n".format(experience.street)+ 
              "{0}, {1} {2}\n".format(experience.city, experience.state, experience.zip)+ 
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

      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: 'noreply@plusmoretablets.com',
        subject: 'Cancelled - Reservation for {0}'.format(experience.title),
        text: "Reservation for {0} has been cancelled.\n\n".format(experience.title) + 
              "Reservation Details:\n\n" + 
              "For: {0}\n".format(experience.title) + 
              "When: {0}\n".format(reservation.when) + 
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

    var requestSchema = _.clone(Schema.request._schema);
    switch (request.type) {
      case 'transportation':
        var transportationSchema = new SimpleSchema({
          date: {
            type: Date
          },
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
        var bellServiceSchema = new SimpleSchema({
          date: {
            type: Date
          }
        });
        requestSchema = _.extend(requestSchema, {
          options: {
            type: bellServiceSchema
          }
        });
        break;
      case 'houseKeeping': 
        var houseKeepingSchema = new SimpleSchema({
          date: {
            type: Date
          }
        });
        requestSchema = _.extend(requestSchema, {
          options: {
            type: houseKeepingSchema
          }
        });
        break;
      case 'wakeUpCall': 
        var wakeUpCallSchema = new SimpleSchema({
          date: {
            type: Date
          }
        });
        requestSchema = _.extend(requestSchema, {
          options: {
            type: wakeUpCallSchema
          }
        });
        break;
      case 'valetServices': 
        var valetServicesSchema = new SimpleSchema({
          date: {
            type: Date
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
    var deviceId = user.deviceId;
    var device = Devices.findOne(deviceId);
    if (!device) {
      throw new Meteor.Error(500, 'Not a proper device');
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(500, 'Not a valid hotel');
    }

    // valid request
    var stay = Stays.findOne({userId: user._id});
    var order = {
      type: 'request',
      for: request.for,
      deviceId: device._id,
      deviceLocation: device.location,
      hotelId: hotel._id,
      stayId: stay._id,
      request: request,
      requestedAt: new Date(),
      open: true,
      status: 'pending',
      userId: user._id
    };

    var orderId = Orders.insert(order);

    this.unblock();

    if (Meteor.isServer) {
      var url = stripTrailingSlash(Meteor.settings.apps.admin.url) + "/patron-order/{0}".format(orderId);

      // for our information
      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: "noreply@plusmoretablets.com",
        subject: "Info: Device in {0} at {1} has requested hotel service.\n\n".format(device.location, hotel.name), 
        text: "This is an informational email and does not require your service\n\n" + 
              "Device in {0} at {1} has requested hotel service.\n\n".format(device.location, hotel.name)  + 
              "Request Details:\n\n" + 
              "For: {0}\n".format(order.request.type) + 
              "When: {0}\n".format(moment(order.request.options.date).calendar()) + 
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