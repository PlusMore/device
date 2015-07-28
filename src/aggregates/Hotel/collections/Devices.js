Devices = new Meteor.Collection('devices');
Devices.service = PlusMore.Services.HotelService;

// Allow/Deny

Devices.allow({
  insert: function(userId, doc) {
    return Roles.userIsInRole(userId, ['hotel-manager', 'hotel-staff', 'admin']);
  },
  update: function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['hotel-manager', 'hotel-staff', 'admin']);
  },
  remove: function(userId, doc) {
    return Roles.userIsInRole(userId, ['hotel-manager', 'hotel-staff', 'admin']);
  }
});

Devices.helpers({
  room: function() {
    return Rooms.findOne(this.roomId);
  }
});

Devices.setupDevice = function(options, callback) {
  Devices.service.call('setupDevice', options, function(err, result) {
    return callback && callback(error, result);
  });
}
