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
          console.log('subscribing for userId', user._id);
          subscriptions.deviceData = Meteor.subscribe('deviceData');
          subscriptions.orders = Meteor.subscribe('orders');
          subscriptions.stayInfo = Meteor.subscribe('stayInfo');
        }
      }
    }
    else {
      console.log('unsubscribing user data');
      if (subscriptions.deviceData) {
        subscriptions.deviceData.stop();
        subscriptions.deviceData = null;
      }

      if (subscriptions.orders) {
        subscriptions.orders.stop();
        subscriptions.orders = null;
      }

      if (subscriptions.stayInfo) {
        subscriptions.stayInfo.stop();
        subscriptions.stayInfo = null;
      }
    }
    
  });
});