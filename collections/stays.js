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
  registerStay: function (deviceId, checkoutDate) {
    debugger;
    check(deviceId, String);
    check(checkoutDate, {
      date: Date,
      zone: Number
    });

    var device = Devices.findOne(user.deviceId);
    if (!device) {
      throw new Meteor.Error(500, 'Not a valid device');
    }

    if (device.stayId) {
      var stay = Stays.findOne(device.stayId);

      if (stay) {
        if (moment.zone(checkoutDate.zone) < moment(stay.checkoutDate.date).zone()) {
          // this device already has a registered stay
          throw new Meteor.Error(500, 'This device\'s current stay has not ended.');
        }
      }
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(500, 'Not a valid hotel');
    }

    var stayId = Stays.insert({
      checkInDate: new Date(),
      checkoutDate: checkoutDate.date,
      zone: checkoutDate.zone,
      hotelId: hotel._id,
      deviceId: device._id
    });

    Devices.update(device._id, {$set: {stayId: stayId}});

    return Stays.findOne(stayId);
  },
  endStay: function (stay) {
    var currentDeviceId = Meteor.user().deviceId;
    Stays.update(stay._id, {$set: {
      checkoutDate: new Date()
    }});
    return currentDeviceId;
  },
  changeCheckoutDate: function(stayId, checkoutDate) {
    check(stayId, String);
    check(checkoutDate, Date);
    Stays.update(stayId, {$set: {checkoutDate: checkoutDate}});
  }
});
