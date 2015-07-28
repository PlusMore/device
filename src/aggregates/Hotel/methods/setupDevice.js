

// TODO: Refactor into setupNewDevice, and replaceExistingDevice
// UI will have to change to support this. It should let the user select a hotel,
// then a room. The user hits next and sees a list of existing devices for the
// room, and the option to set up a new device.
// We should use 'location' to track the location in the room.

Meteor.methods({
  setupDevice: function(deviceSetupOptions) {
    check(deviceSetupOptions, Schema.setupDevice);

    // If that user is not logged in, he'll get an error
    if(!this.userId) {
      throw new Meteor.Error(401, "Unauthorized");
    }

    // this is a crutch to help the transition go smoothly
    // deviceSetupOptions.location should be most likely be removed in next refactor
    var room = Rooms.findOne(deviceSetupOptions.roomId);
    deviceSetupOptions.location = room.name;

    if (!Roles.userIsInRole(Meteor.user(), ['hotel-staff', 'admin'])) {
      throw new Meteor.Error(401, "Unauthorized");
    }

    var hotel = Hotels.findOne(deviceSetupOptions.hotelId);
    if (!hotel) {
      throw new Meteor.Error(302, "This isn't a valid hotel");
    }

    var deviceWithSameRoomId = Devices.findOne({
      hotelId: hotel._id,
      roomId: deviceSetupOptions.roomId
    });

    if (deviceSetupOptions.roomId && deviceWithSameRoomId) {
      if (deviceSetupOptions.replacement) {
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

    deviceSetupOptions.registrationDate = new Date();
    return Devices.insert(deviceSetupOptions);
  }
});
