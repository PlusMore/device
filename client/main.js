/* ---------------------------------------------------- +/

## Main ##

Global client-side code. Loads last.

/+ ---------------------------------------------------- */
var subs = new SubsManager();

//
Meteor.startup(function() {


  // if in room and registered, get device data,
  // hotel for device.hotelid
  // hotel services for device.hotelid
  Tracker.autorun(function() {
    var inRoom = LocalStore.get('inRoom');
    var registeredDeviceId = LocalStore.get('deviceId');

    if (inRoom && registeredDeviceId) {
      
        console.log('in room, getting deviceData for registered device');
        subscriptions.registeredDeviceData = subs.subscribe('device', registeredDeviceId);
        
        console.log('in room, getting experiencesData for registered device');
        subscriptions.registeredDeviceExperiencesData = subs.subscribe('experiencesData', registeredDeviceId);
      
    } else {

      if (subscriptions.registeredDeviceData) {
        subscriptions.registeredDeviceData.stop();
        delete subscriptions.registeredDeviceData;
      }

      if (subscriptions.registeredDeviceExperiencesData) {
        subscriptions.registeredDeviceExperiencesData.stop();
        delete subscriptions.registeredDeviceExperiencesData;
      }

    }  
  });


  // if in room and registered
  // when device data available, set stayId
  Tracker.autorun(function() {
    var inRoom = LocalStore.get('inRoom');
    var registeredDeviceId = LocalStore.get('deviceId');
    var devices = Devices.find();

    if (inRoom && registeredDeviceId && devices.count() > 0) {
      if (Devices.findOne().stayId) {
        console.log('received device data with stayId');
        Session.set('stayId', Devices.findOne().stayId);
      } else {
        console.log('received device data, no stay id');
      }
    }
  });

  // when logged in and not in room, get experiencesData for user
  Tracker.autorun(function() {
    var inRoom = LocalStore.get('inRoom');
    var user = Meteor.user();

    if (!inRoom && user) {
      console.log('not in room, getting experiencesData for user');
      subscriptions.experiencesDataForUser = subs.subscribe('experiencesData');
    } else {
      if (subscriptions.experiencesDataForUser) {
        subscriptions.experiencesDataForUser.stop();
        delete subscriptions.experiencesDataForUser;
      }
    }
    
  });


  // if not in room, and stayId set, get device data by stay id
  // and hotel for device,
  // and hotel services for device
  Tracker.autorun(function() {
    var stayId = Session.get('stayId');
    var inRoom = LocalStore.get('inRoom');

    if (!inRoom && stayId) {
      console.log('not in room, getting device by stayId')
      subscriptions.deviceByStay = subs.subscribe('deviceByStayId', stayId);
    } else {
      if (subscriptions.deviceByStay) {
        subscriptions.deviceByStay.stop();
        delete subscriptions.deviceByStay;
      }
    }  
  });

  // if in room, and registered, get stays for device
  Tracker.autorun(function() {
    var inRoom = LocalStore.get('inRoom');
    var registeredDeviceId = LocalStore.get('deviceId');

    if (inRoom && registeredDeviceId) {
      console.log('in room, get stay info for deviceId');
      subscriptions.deviceStays = subs.subscribe('deviceStays', registeredDeviceId);
    } else {
      if (subscriptions.deviceStays) {
        subscriptions.deviceStays.stop();
        delete subscriptions.deviceStays;
      }
    }
  });
  
  // if not in room, get stay by user id
  Tracker.autorun(function() {
    var userId = Meteor.userId(); 
    var inRoom = LocalStore.get('inRoom');

    if (!inRoom && userId) {
      console.log('not in room, get user stays');
      subscriptions.userStays = subs.subscribe('userStays', userId);
    } else {
      if (subscriptions.userStays) {
        subscriptions.userStays.stop();
        delete subscriptions.userStays;
      }
    }  
  });

  // if a stay becomes available, set stayId for session
  Tracker.autorun(function() {
    var stays = Stays.find();
    var user = Meteor.user();
    var inRoom = LocalStore.get('inRoom');

    if (!inRoom && user && stays.count() > 0) {
      
      console.log('not in room, stay subscription data received for user', stays.count());
      var stay = Stays.findOne();
      Session.set('stayId', stay._id);

    } else if (!inRoom && user && stays.count() === 0) {

      if (!Session.get('onboarding')) {
        console.log('unset stay info, not in room');
        Session.set('stayId', undefined);
      }

    } else if (inRoom && user && stays.count() === 0) {
      if (!Session.get('onboarding')) {
        console.log('unset stay info, in room');
        Session.set('stayId', undefined);
        Meteor.logout();
        
      }
    }
  });

  // if we get stayid, subscribe to info for it
  Tracker.autorun(function() {
    var stayId = Session.get('stayId');
    if (stayId) {
      subscriptions.stayInfo = subs.subscribe('stayInfo', stayId);
    } else {
      if (subscriptions.stayInfo) {
        subscriptions.stayInfo.stop();
        subscriptions.stayInfo = null;
      }
    }
  });  
});