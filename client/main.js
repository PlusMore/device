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
      subscriptions.device = Meteor.subscribe('device', registeredDeviceId);
      subscriptions.experiencesData = Meteor.subscribe('experiencesData', registeredDeviceId);
    }
  });

  // on login, get stay info, use that to find and set deviceId to LocalStore
  Deps.autorun(function () {
    var user = Meteor.user();

    if (user) {
      console.log('subscribing for userId', user._id);
      // subscriptions.experiencesData = Meteor.subscribe('experiencesData');
      subscriptions.orders = Meteor.subscribe('orders');
      subscriptions.stayInfo = Meteor.subscribe('stayInfo');
    }
    else {

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

  Deps.autorun(function() {
    var stays = Stays.find();
    if (stays.count() > 0) {
      Session.set('stayId', Stays.findOne()._id);
    }
  });
});


// $(document).load(function(){
//   $('.preloader').fadeOut(1000); // set duration in brackets
// });