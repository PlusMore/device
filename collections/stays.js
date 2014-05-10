Stays = new Meteor.Collection('stays');

Stays.allow({
  insert: function (userId, doc) {
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    return userId === doc.userId;
  },
  remove: function (userId, doc) {
    return false;
  }
});

Meteor.methods({
  registerStay: function (checkoutDate) {
    check(checkoutDate, Date);
    var user = Meteor.user();

    var stay = Stays.findOne({userId: user._id, active: true, checkoutDate: {$gt: new Date()}});

    if (stay) {
      throw new Meteor.Error(500, 'Stay already registered for this user');
    }

    var device = Devices.findOne(user.deviceId);
    if (!device) {
      throw new Meteor.Error(500, 'Not a valid device');
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(500, 'Not a valid hotel');
    }

    var stayId = Stays.insert({
      userId: user._id,
      checkInDate: new Date(),
      checkoutDate: checkoutDate,
      hotelId: hotel._id,
      deviceId: device._id,
      active: true
    });

    return stayId;
  },
  endStay: function (stay) {
    var currentDeviceId = Meteor.user().deviceId;
    Stays.update(stay._id, {$set: {active: false}});
    return currentDeviceId;
  },
  changeCheckoutDate: function(stayId, checkoutDate) {
    check(stayId, String);
    check(checkoutDate, Date);
    Stays.update(stayId, {$set: {checkoutDate: checkoutDate}});
  }
});
