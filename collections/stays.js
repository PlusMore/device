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
    check(deviceId, String);
    check(checkoutDate, {
      date: Date,
      zone: Number
    });

    var device = Devices.findOne(deviceId);
    if (!device) {
      throw new Meteor.Error(500, 'Not a valid device');
    }

    if (device.stayId) {
      var stay = Stays.findOne(device.stayId);

      if (stay) {
        if (moment().zone(checkoutDate.zone) < moment(stay.checkoutDate.date).zone()) {
          // this device already has a registered stay
          // if no users, allow it to be overwritten

          if (stay.users.length > 0) 
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
  addUserToStay: function(stayId) {
    var user = Meteor.user();

    if (user) {

      var stay = Stays.findOne(stayId);

      if (!stay) {
        throw new Meteor.Error(500, 'Stay not found.');
      }  

      Meteor.users.update(user._id, {$set: {stayId: stay._id}});
      return Stays.update(stay._id, {$addToSet: {users: user._id}});

    } else {
      throw new Meteor.Error(403, 'Please log in to use this feature');
    }
  },
  stayOver: function (stayId) {
    var stay = Stays.findOne(stayId);

    // if stay is over, end it.
    if (moment().zone(stay.zone) > moment(stay.checkoutDate).zone(stay.zone)) {
      Stays.update(stayId, {$set: {active: false}});
      Devices.update(stay.deviceId, {$unset: {stayId: 1}});
      Meteor.users.update({_id: {$in: stay.users}}, {$unset: {stayId: 1}});
    }
  },
  endStay: function (stayId) {
    return Stays.update(stayId, {$set: {
      checkoutDate: new Date()
    }});
  },
  changeCheckoutDate: function(stayId, checkoutDate) {
    check(stayId, String);
    check(checkoutDate, Date);
    Stays.update(stayId, {$set: {checkoutDate: checkoutDate}});
  }
});
