Template.welcome.helpers({
  device: function() {
    var deviceId = Session.get('deviceId');
    return Devices.findOne(deviceId);
  }
});