Meteor.methods({
  setupDevice: function(device) {
    check(device, Schema.setupDevice);

    // this is a crutch to help the transition go smoothly
    // device.location should be most likely be removed in next refactor
    var room = Rooms.findOne(device.roomId);
    device.location = room.name;

    if (!Roles.userIsInRole(Meteor.user(), ['hotel-staff', 'admin'])) {
      throw new Meteor.Error(401, "Unauthorized");
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(302, "This isn't a valid hotel");
    }

    var deviceWithSameRoomId = Devices.findOne({
      hotelId: hotel._id,
      roomId: device.roomId
    });

    if (device.roomId && deviceWithSameRoomId) {
      if (device.replacement) {
        console.log('replacing device in room: ' + room.name + ' (' + deviceWithSameRoomId._id + ') in ' + hotel.name);
        var locationReplaced = room.name + ' Replaced ' + moment().format('MMMM Do YYYY');
        Devices.update(deviceWithSameRoomId._id, {
          $set: {
            location: locationReplaced,
            replacementDate: new Date(),
            replaced: true,
            roomId: undefined
          }
        });
      } else {
        throw new Meteor.Error(302, 'A device with the same room has already been setup', deviceWithSameRoomId._id);
      }
    }

    device.registrationDate = new Date();
    return Devices.insert(device);
  }
});
