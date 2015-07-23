Schema.requestService = new SimpleSchema({
  type: {
    type: String
  },
  serviceId: {
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
  },
  tip: {
    type: Number,
    optional: true
  }
});

var getTypeOptionsSimpleSchema = function(serviceType) {
  switch (serviceType) {

      case 'bellService':
      case 'houseKeeping':
      case 'wakeUpCall':
        // Nothing extra needed
        return false;
        break;
      case 'transportation':
        return new SimpleSchema({
          transportationType: {
            type: String
          }
        });
        break;
      case 'valetServices':
        return new SimpleSchema({
          ticketNumber: {
            type: String
          }
        });
        break;
      default:
        console.log('The type of service requested has not been configured');
        throw new Meteor.Error(500, 'Service type is not configured', serviceRequest);
        break;
    }
}

// Request Service requirements
//
// User: Must be a logged in user of PlusMore
// Stay: Has to have a valid stay
// Room: Stay has to have a valid room
// Hotel: Room needs a valid hotel
//
// Notifications: Should send a notification
// - handled in notification event handlers

Meteor.methods({
  requestService: function(serviceRequest, stayId) {
    console.log('A guest is attempting to request a hotel service', serviceRequest.type);

    // ********** VALIDATION ***************

    // check args
    check(serviceRequest, Object);
    check(stayId, String)

    // Check that type is provided
    check(serviceRequest.type, String);

    // add any validation to schema for specific request types
    var serviceSchemaJSON = _.clone(Schema.requestService._schema);
    var serviceTypeOptionsSimpleSchema = getTypeOptionsSimpleSchema(serviceRequest.type);
    var optionsSchemaJSON;
    if (serviceTypeOptionsSimpleSchema) {
      optionsSchemaJSON = {
        options: {
          type: serviceTypeOptionsSimpleSchema
        }
      }
      serviceSchemaJSON = _.extend(serviceSchemaJSON, optionsSchemaJSON);
    }

    check(serviceRequest, new SimpleSchema(serviceSchemaJSON));

    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(403, 'PlusMore Members Only');
    }

    var stay = Stays.findOne(stayId);
    if (!stay) {
      throw new Meteor.Error(403, 'No current stay registered for user');
    }

    if (moment().zone(stay.zone) > moment(stay.checkoutDate).zone(stay.zone)) {
      throw new Meteor.Error(500, 'The provided stay has ended.');
    }

    var room = Rooms.findOne(stay.roomId);
    if (!room) {
      throw new Meteor.Error(500, 'Stay does not belong to a valid room');
    }

    var hotel = Hotels.findOne(room.hotelId);
    if (!hotel) {
      throw new Meteor.Error(500, 'Room does not belong to a valid hotel');
    }

    // ************ END VALIDATION **************

    // valid service
    var order = {
      type: 'service',
      handledBy: serviceRequest.handledBy,
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

    HotelGuestApp.Events.emit('order:hotel-service-requested', {
      orderId: orderId
    });

    return orderId;
  }
});
