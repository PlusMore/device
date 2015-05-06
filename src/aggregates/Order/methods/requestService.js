Schema.requestService = new SimpleSchema({
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


Meteor.methods({
  requestService: function(serviceRequest, stayId) {
    // Check that type is provided
    check(serviceRequest.type, String);

    // add any validation to schema for specific request types
    var serviceSchema = _.clone(Schema.requestService._schema);
    switch (serviceRequest.type) {
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
        throw new Meteor.Error(500, 'Service type is not configured', serviceRequest);
    }

    check(serviceRequest, new SimpleSchema(serviceSchema));

    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    var stay = Stays.findOne(stayId);
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
      service: serviceRequest,
      requestedDate: new Date(),
      requestedZone: serviceRequest.zone,
      open: true,
      status: 'requested',
      userId: user._id
    };

    var orderId = Orders.insert(order);

    this.unblock();

    if (Meteor.isServer) {
      var url = stripTrailingSlash(Meteor.settings.apps.admin.url) + "/patron-order/{0}".format(orderId);
      var when = moment(serviceRequest.date).zone(serviceRequest.zone);
      when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";

      var friendlyServiceType = HotelServices.friendlyServiceType(serviceRequest.type);

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
  }
});
