Meteor.publish('device', function(deviceId) {
  if (deviceId) {
    console.log('publishing device data for ' + deviceId);
    var device = Devices.findOne(deviceId);
    if (device) {
      return [
        Devices.find(deviceId)
      ];
    } else {
      console.log('no device data found for ' + deviceId);
    }
  }
});
