Devices = new Meteor.Collection('devices');

// Allow/Deny

Devices.allow({
  insert: function(userId, doc){
    return Roles.userIsInRole(userId, ['hotel-staff', 'admin']);
  },
  update:  function(userId, doc, fieldNames, modifier){
    return Roles.userIsInRole(userId, ['hotel-staff', 'admin']);
  },
  remove:  function(userId, doc){
    return Roles.userIsInRole(userId, ['hotel-staff', 'admin']);
  }
});

Schema.setupDevice = new SimpleSchema({
  type: {
    type: String,
    label: 'Will this device be placed in a room or a lobby?'
  },
  location: {
    type: String,
    label: "Where will this this be device located? (Ex. 'Room 131', 'Lobby Entrance')"
  },
  hotelId: {
    type: String
  }
});

Meteor.methods({
  setupDevice: function(device) {
    check(device, Schema.setupDevice);

    if (!Roles.userIsInRole(Meteor.user(), ['hotel-staff', 'admin'])) {
      throw new Meteor.Meteor.Error(401, "Unauthorized");
    }

    var deviceWithSameLocation = Devices.findOne({location: device.location});

    if (device.location && deviceWithSameLocation) {
      throw new Meteor.Error(302,
        'A device with this location has already been setup',
        deviceWithSameLocation._id);
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Meteor.Error(302, "This isn't a valid hotel");
    }

    return Devices.insert(device);
  }
});