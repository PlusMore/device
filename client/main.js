/* ---------------------------------------------------- +/

## Main ##

Global client-side code. Loads last.

/+ ---------------------------------------------------- */


//
Meteor.startup(function() {


  if (LocalStore.get('inRoom')) {

    console.log('in room subscriptions');

    Tracker.autorun(function() {
      var registeredDeviceId = LocalStore.get('deviceId');

      if (registeredDeviceId) {
        console.log('subscriptions for registered device');
        subscriptions.device = Meteor.subscribe('device', registeredDeviceId);
        subscriptions.experiencesData = Meteor.subscribe('experiencesData', registeredDeviceId);
      } else {
        if (subscriptions.device) {
          subscriptions.device.stop();
          subscriptions.device = null;
        }
        if (subscriptions.experiencesData) {
          subscriptions.experiencesData.stop();
          subscriptions.experiencesData = null;
        }
      }  
    });

    // when device is available
    Tracker.autorun(function () {
      var device = Devices.find();
      if (device.count() > 0) {
        // LocalStore.set('deviceId')
        Session.set('stayId', Devices.findOne().stayId);
      }
    });

  } else {

    console.log('mobile subscriptions');

    Tracker.autorun(function() {
      if (Meteor.user()) {
        subscriptions.experiencesData = Meteor.subscribe('experiencesData');
      } else {
        if (subscriptions.experiencesData) {
          subscriptions.experiencesData.stop();
          subscriptions.experiencesData = null;
        }
      }
    });

    Tracker.autorun(function() {
      var stayId = Session.get('stayId');
      if (stayId) {
        console.log('device by stayId')
        subscriptions.device = Meteor.subscribe('deviceByStayId', stayId);
      } else {
        if (subscriptions.device) {
          subscriptions.device.stop();
          subscriptions.device = null;
        }
      }
    });
  }

  Tracker.autorun(function() {
    var userId = Meteor.userId(); 
    if (userId) {
      subscriptions.userStays = Meteor.subscribe('userStays', userId);
    } else {
      if (subscriptions.userStays) {
        subscriptions.userStays.stop();
        subscriptions.userStays = null;
      }
    }
  });

  // if a stay becomes available, set stayId for session
  Tracker.autorun(function() {
    var stays = Stays.find();
    if (stays.count() > 0) {
      console.log('stay subscription data received');
      var stay = Stays.findOne();
      Session.set('stayId', stay._id);
      if (!LocalStore.get('inRoom'))
        LocalStore.set('deviceId', stay.deviceId);
    } else {
      if (!Session.get('onboarding')) {
        console.log('unset stay info');
        Session.set('stayId', undefined);
        if (!LocalStore.get('inRoom')) {
          LocalStore.set('deviceId', null);
        } else {
          Meteor.logout();
        }
      }
    }
  });

  // if we get stayid, subscribe to info for it
  Tracker.autorun(function() {
    var stayId = Session.get('stayId');
    if (stayId) {
      subscriptions.stayInfo = Meteor.subscribe('stayInfo', stayId);
    } else {
      if (subscriptions.stayInfo) {
        subscriptions.stayInfo.stop();
        subscriptions.stayInfo = null;
      }
    }
  });  
});