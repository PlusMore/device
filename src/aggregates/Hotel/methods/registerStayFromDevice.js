Meteor.methods({
  registerStayFromDevice: function(deviceId, checkoutDate) {
    console.log('device is attempting to register a stay', deviceId, checkoutDate.date);

    check(deviceId, String);
    check(checkoutDate, {
      date: Date,
      zone: Number
    });

    var device = Devices.findOne(deviceId);
    if (!device) {
      throw new Meteor.Error(500, 'Not a valid device');
    }

    var room = Rooms.findOne(device.roomId);
    if (!room) {
      throw new Meteor.Error(500, 'Not a valid room');
    }

    if (room.stayId) {
      var stay = Stays.findOne(room.stayId);

      if (stay) {
        if (moment().zone(checkoutDate.zone) < moment(stay.checkoutDate.date).zone()) {
          // this room already has a registered stay
          // if no users, allow it to be overwritten

          if (stay.users.length > 0)
            throw new Meteor.Error(500, 'This room\'s current stay has not ended.');
        }
      }
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(500, 'Not a valid hotel');
    }

    Stays.update({
      roomId: room._id
    }, {
      $set: {
        active: false
      }
    });
    var stayId = Stays.insert({
      checkInDate: new Date(),
      checkoutDate: checkoutDate.date,
      zone: checkoutDate.zone,
      hotelId: hotel._id,
      roomId: room._id,
      roomName: room.name, // Used frequently in UI, so denormalized
      active: true
    });

    Rooms.update(room._id, {
      $set: {
        stayId: stayId
      }
    });


    return stayId;
  }
});
