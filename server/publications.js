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
    var fields = {hotelId:1},
      user = Meteor.users.findOne({_id:userId}),
      hotelId = user && user.hotelId || null;
    if (hotelId) {
      return [
        Meteor.users.find({_id: userId}, {fields: fields}),
        Hotels.find({_id: hotelId})
      ]
    } else {
      this.ready();
      return null;
    }
  } else {
    this.ready();
    return null;
  }
});

/**
 * Always publish logged-in user's deviceId
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
          Hotels.find(device.hotelId)
        ]
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

Meteor.publish('deviceData', function(deviceId) {
  var userId = this.userId,
      user = Meteor.users.findOne(userId);

  if (user) {
    var deviceId = user.deviceId;
    var device = Devices.findOne(deviceId);

    if (device) {
      var experienceFields = {
        active: 1,
        category: 1,
        lead: 1,
        photoUrl: 1,
        title: 1
      }
      return [
        Categories.find({active: true}),
        Experiences.find({active: true}, {sort: {sortOrder: 1}, fields: experienceFields})
      ]
    }
  } else {
    return null;
  }
});

Meteor.publish('orders', function() {
  return [
    Orders.find({userId: this.userId})
  ]
});