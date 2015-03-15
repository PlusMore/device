/* ---------------------------------------------------- +/

## Main ##

Global client-side code. Loads last.

/+ ---------------------------------------------------- */
var subs = new SubsManager();

//
Meteor.startup(function() {

  subs.subscribe('nav');
  subs.subscribe('experiencesData');

  // if in room and registered, get device data,
  // hotel for device.hotelid
  // hotel services for device.hotelid
  Tracker.autorun(function() {
    var kiosk = LocalStore.get('kiosk');
    var registeredDeviceId = LocalStore.get('deviceId');

    if (kiosk && registeredDeviceId) {

      console.log('in room, getting deviceData for registered device');
      subscriptions.registeredDeviceData = Meteor.subscribe('device', registeredDeviceId);

    } else {

      if (subscriptions.registeredDeviceData) {
        subscriptions.registeredDeviceData.stop();
        delete subscriptions.registeredDeviceData;
      }

    }
  });

  // if not in room, and stayId set, get device data by stay id
  // and hotel for device,
  // and hotel services for device
  Tracker.autorun(function() {
    var stayId = Session.get('stayId');
    var kiosk = LocalStore.get('kiosk');

    if (!kiosk && stayId) {
      console.log('not in room, getting device by stayId');
      subscriptions.deviceByStay = Meteor.subscribe('deviceByStayId', stayId);
    } else {
      if (subscriptions.deviceByStay) {
        subscriptions.deviceByStay.stop();
        delete subscriptions.deviceByStay;
      }
    }
  });

  // if not in room, get stay by user id
  Tracker.autorun(function() {
    var userId = Meteor.userId();
    var kiosk = LocalStore.get('kiosk');

    if (!kiosk && userId) {
      console.log('not in room, get user stays');
      subscriptions.userStays = Meteor.subscribe('userStays');
    } else {
      if (subscriptions.userStays) {
        subscriptions.userStays.stop();
        delete subscriptions.userStays;
      }
    }
  });

  // if in room and registered
  // when device data available, set stayId
  Tracker.autorun(function() {
    var kiosk = LocalStore.get('kiosk');
    var registeredDeviceId = LocalStore.get('deviceId');
    var devices = Devices.find();
    var rooms = Rooms.find();

    if (kiosk && registeredDeviceId && devices.count() > 0) {
      var roomId = Devices.findOne().roomId;
      if (Rooms.findOne(roomId) && Rooms.findOne(roomId).stayId) {
        console.log('received device data with stayId');
        Session.set('stayId', Rooms.findOne(roomId).stayId);
      } else {
        console.log('received device data, no stay id');
      }
    }
  });

  // if a stay becomes available another way, set stayId for session
  Tracker.autorun(function() {
    var stays = Stays.find();
    var user = Meteor.user();
    var kiosk = LocalStore.get('kiosk');

    if (!kiosk && user && stays.count() > 0) {

      console.log('not in room, stay subscription data received for user', stays.count());
      var stay = Stays.findOne();
      Session.set('stayId', stay._id);

    } else if (!kiosk && user && stays.count() === 0) {

      if (!Session.get('onboarding')) {
        console.log('unset stay info, not in room');
        Session.set('stayId', undefined);
      }

    } else if (kiosk && user && stays.count() === 0) {
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
      subscriptions.stayInfo = Meteor.subscribe('stayInfo', stayId);
    } else {
      if (subscriptions.stayInfo) {
        subscriptions.stayInfo.stop();
        subscriptions.stayInfo = null;
      }
    }
  });
});
