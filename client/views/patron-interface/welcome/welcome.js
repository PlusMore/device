Template.welcome.helpers({
  device: function() {
    var deviceId = Meteor.user().deviceId;
    return Devices.findOne(deviceId);
  }
});