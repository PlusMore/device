Devices = new Meteor.Collection('devices');

// Allow/Deny

Devices.allow({
  insert: function(userId, doc){
    return Roles.userIsInRole(userId, ['hotel-manager', 'hotel-staff', 'admin']);
  },
  update:  function(userId, doc, fieldNames, modifier){
    return Roles.userIsInRole(userId, ['hotel-manager', 'hotel-staff', 'admin']);
  },
  remove:  function(userId, doc){
    return Roles.userIsInRole(userId, ['hotel-manager', 'hotel-staff', 'admin']);
  }
});

Schema.setupDevice = new SimpleSchema({
  location: {
    type: String,
    label: "Where will this this be device located? (Ex. 'Room 131', 'Lobby Entrance')"
  },
  hotelId: {
    type: String
  },
  replacement: {
    type: Boolean,
    label: 'Replacement device?'
  }
});

Meteor.methods({
  setupDevice: function(device) {
    check(device, Schema.setupDevice);

    if (!Roles.userIsInRole(Meteor.user(), ['hotel-staff', 'admin'])) {
      throw new Meteor.Error(401, "Unauthorized");
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(302, "This isn't a valid hotel");
    }

    var deviceWithSameLocation = Devices.findOne({hotelId: hotel._id, location: device.location});

    if (device.location && deviceWithSameLocation) {
      if (device.replacement) {
        console.log('replacing device in ' + device.location + ' ('+ deviceWithSameLocation._id + ') in ' + hotel.name);
        var locationReplaced = deviceWithSameLocation.location + ' Replaced ' + moment().format('MMMM Do YYYY');
        Devices.update(deviceWithSameLocation._id, {$set: {location: locationReplaced, replacementDate: new Date()}});
      } else {
        throw new Meteor.Error(302, 'A device with this location has already been setup', deviceWithSameLocation._id);
      }
    }

    device.registrationDate = new Date();
    return Devices.insert(device);
  }
});