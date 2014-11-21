/* ---------------------------------------------------- +/

## Main ##

Global client-side code. Loads last.

/+ ---------------------------------------------------- */


//
Meteor.startup(function() {



  // Subscribe to device data when a device ID is available
  Tracker.autorun(function() {
    var registeredDeviceId = LocalStore.get('deviceId');

    if (registeredDeviceId) {
      console.log('registered device');
      console.log('subscribing to device, experiencesData, and stayInfo')
      subscriptions.device = Meteor.subscribe('device', registeredDeviceId);
      subscriptions.experiencesData = Meteor.subscribe('experiencesData', registeredDeviceId);
      subscriptions.stayInfo = Meteor.subscribe('stayInfo');
    } else {
      console.log('unsubscribing device, experiencesData, and stayInfo')

      if (subscriptions.device) {
        subscriptions.device.stop();
        subscriptions.device = null;
      }
      if (subscriptions.experiencesData) {
        subscriptions.experiencesData.stop();
        subscriptions.experiencesData = null;
      }
      if (subscriptions.stayInfo) {
        subscriptions.stayInfo.stop();
        subscriptions.stayInfo = null;
      }
    }
  });

  // on login, get stay info, use that to find and set deviceId to LocalStore
  Tracker.autorun(function () {
    var user = Meteor.user();

    if (user) {
      // subscriptions.experiencesData = Meteor.subscribe('experiencesData');
      // subscriptions.orders = Meteor.subscribe('orders');
      // subscriptions.stayInfo = Meteor.subscribe('stayInfo');
    }
    else {

      // if (subscriptions.orders) {
      //   subscriptions.orders.stop();
      //   subscriptions.orders = null;
      // }

      // if (subscriptions.stayInfo) {
      //   subscriptions.stayInfo.stop();
      //   subscriptions.stayInfo = null;
      //   Session.set('stayId', undefined);
      // }
    }
    
  });

  Tracker.autorun(function() {
    var stays = Stays.find();
    if (stays.count() > 0) {
      Session.set('stayId', Stays.findOne()._id);
    }
  });
});


// $(document).load(function(){
//   $('.preloader').fadeOut(1000); // set duration in brackets
// });