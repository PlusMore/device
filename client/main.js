/* ---------------------------------------------------- +/

## Main ##

Global client-side code. Loads last.

/+ ---------------------------------------------------- */

//

Meteor.startup(function() {
  // Subscribe to device data when a device ID is available
  Deps.autorun(function () {
    var user = Meteor.user();

    if (user) {
      var deviceId = user.deviceId || null;

      if (deviceId) {
        var deviceId = Meteor.user().deviceId,
        device = Devices.findOne(deviceId);

        if (device) {
          Meteor.subscribe('deviceData');
          Meteor.subscribe('orders');
        }
      }
    }
    
  });
});

// Meteor.call('changeCheckoutDate', Stays.findOne()._id, moment().toDate())