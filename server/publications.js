/* ---------------------------------------------------- +/

## Publications ##

All publications-related code.

/+ ---------------------------------------------------- */

// /**
//  * Always publish logged-in user's hotelId
//  *
//  */
Meteor.publish('userHotelData', function () {
  var userId = this.userId;

  if (userId) {

    // if admin, publish all hotels
    // if hotel staff, only publish that hotel
    if (Roles.userIsInRole(userId, 'admin')) {
      return Hotels.find();
    } else if (Roles.userIsInRole(userId, 'hotel-staff')) {
      var fields = {hotelId:1},
      user = Meteor.users.findOne({_id:userId}),
      hotelId = user && user.hotelId || null;
      if (hotelId) {
        return [
          Meteor.users.find({_id: userId}, {fields: fields}),
          Hotels.find({_id: hotelId})
        ];
      } else {
        this.ready();
        return null;
      }
    }

  } else {
    this.ready();
    return null;
  }
});

/**
 * Always publish logged-in devices deviceId, device data, hotel data, and hotel-service data
 *
 */
Meteor.publish(null, function () {
  var userId = this.userId;
  
  if (userId) {
    var fields = {deviceId:1},
        user = Meteor.users.findOne({_id:userId}),
        deviceId = user && user.deviceId || null;
    if (deviceId) {

      var device = Devices.findOne(deviceId);
      if (device) {
        return [
          Meteor.users.find(userId, {fields: fields}),
          Devices.find(deviceId),
          Hotels.find(device.hotelId),
          HotelServices.find({hotelId: device.hotelId})
        ];
      }

    } else {
      this.ready();
      return null;
    }
  } else {
    this.ready();
    return null;
  }
});

Meteor.publish('stayInfo', function() {
  return [
    Stays.find({userId: this.userId})
  ];
});

Meteor.publish('deviceData', function(deviceId) {
  var userId = this.userId,
      user = Meteor.users.findOne(userId);

  if (user) {
    deviceId = deviceId || user.deviceId;
    var device = Devices.findOne(deviceId);

    if (device) {
      var experienceFields = {
        active: 1,
        category: 1,
        lead: 1,
        photoUrl: 1,
        title: 1
      };
      return [
        Categories.find({active: true}),
        Experiences.find({active: true}, {sort: {sortOrder: 1}})
      ];
    }
  } else {
    return null;
  }
});

Meteor.publish('orders', function() {
  return [
    Orders.find({userId: this.userId})
  ];
});

Meteor.publish('hotelMenu', function(hotelId) {
  var userId = this.userId,
      user = Meteor.users.findOne(userId);

  var hotel = Hotels.find(hotelId);
  if (hotel) {

    var publication = new SimplePublication({
      subHandle: this,
      collection: MenuCategories,
      selector: {
        hotelId: hotelId,
        active: true
      },
      dependant: new SimplePublication({
        subHandle: this,
        collection: MenuItems,
        selector: {
          active: true
        },
        foreignKey: 'menuCategoryId'
      })
    }).start();
  }
  
});

Meteor.publish('cart', function(cartId) {
  return CartItems.find({cartId: cartId});
});
// Meteor.publish('experience', function(id) {
//   return [
//     Experiences.find(id)
//   ];
// });