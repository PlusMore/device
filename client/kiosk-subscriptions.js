/* ---------------------------------------------------- +/

## Kiosk Subscriptions ##

In this file we need to set up subscriptions based on various bits of data.

Kiosk Subscriptions:
--------
If the application is in kiosk mode:
1) Find the Device using the ID from LocalStore.get('deviceId'). Subscribe to 'device' using this to get access to the Device.
2) From device, we can find the room using device.roomId
3) From the room we can find:
  a) the stay using room.stayId (also users for stay)
  b) and the hotel with room.hotelId (also hotel services for hotel)
(Device) -> (Room) -> (Stay) -> [Users]
                   -> (Hotel) -> [HotelServices]

------------------------------------------------------- */

// 1) Find the Device using the ID from LocalStore.get('deviceId'). Subscribe to 'device' using this to get access to the Device.

// if in room and registered, get device data,
// hotel for device.hotelid
// hotel services for device.hotelid

// do not cache this subscription
Tracker.autorun(function() {
  var kiosk = LocalStore.get('kiosk');
  var registeredDeviceId = LocalStore.get('deviceId');

  // if valid kiosk
  if (kiosk && registeredDeviceId) {

    console.log('Kiosk Subscriptions - 1)  Subscribe to device using deviceId to get access to the Device.');
    subscriptions.registeredDeviceData = Meteor.subscribe('device', registeredDeviceId);

  } else {

    if (subscriptions.registeredDeviceData) {
      subscriptions.registeredDeviceData.stop();
      delete subscriptions.registeredDeviceData;
    }

  }
});

// 2) From device, we can find the room using device.roomId
// Do not cache
Tracker.autorun(function() {
  var kiosk = LocalStore.get('kiosk');
  var registeredDeviceId = LocalStore.get('deviceId');
  var devices = Devices.find(); // for reactivity

  var thisDevice = Devices.findOne(registeredDeviceId);

  // if valid kiosk and data available
  if (thisDevice) {

    console.log('Kiosk Subscriptions - 2) From device, we can find the room using device.roomId');
    subscriptions.roomDataForDevice = Meteor.subscribe('room', thisDevice.roomId);

  } else {

    if (subscriptions.roomDataForDevice) {
      subscriptions.roomDataForDevice.stop();
      delete subscriptions.roomDataForDevice;
    }

  }
});

// 3a) From the room we can find the stay using room.stayId
// Subscription also returns users for stay
Tracker.autorun(function() {
  var kiosk = LocalStore.get('kiosk');
  var registeredDeviceId = LocalStore.get('deviceId');
  var rooms = Rooms.find(); // for reactivity
  var devices = Devices.find(); // for reactivity
  var thisDevice = Devices.findOne(registeredDeviceId);
  var thisRoom;

  if (thisDevice) {
    thisRoom = Rooms.findOne(thisDevice.roomId);
  }

  // if valid kiosk and data available
  if (thisRoom) {

    console.log('Kiosk Subscriptions - 3a) From room, we can find the stay using room.stayId');
    subscriptions.stayDataForRoom = Meteor.subscribe('stay', thisRoom.stayId);

  } else {

    if (subscriptions.stayDataForRoom) {
      subscriptions.stayDataForRoom.stop();
      delete subscriptions.stayDataForRoom;
    }

  }
});

// 3b) From the room we can find the hotel using room.hotelId
// other devices will subscribe to the same hotel
// this subscription also gets HotelService information
// Cache might cause reactivity issues, so do not cache
Tracker.autorun(function() {
  var kiosk = LocalStore.get('kiosk');
  var registeredDeviceId = LocalStore.get('deviceId');
  var rooms = Rooms.find(); // for reactivity
  var devices = Devices.find(); // for reactivity
  var thisDevice = Devices.findOne(registeredDeviceId);
  var thisRoom;

  if (thisDevice) {
    thisRoom = Rooms.findOne(thisDevice.roomId);
  }

  // if valid kiosk and data available
  if (thisRoom) {

    console.log('Kiosk Subscriptions - 3b) From room, we can find the hotel using room.hotelId');
    subscriptions.hotelDataForRoom = Meteor.subscribe('hotel', thisRoom.hotelId);

  } else {

    if (subscriptions.hotelDataForRoom) {
      subscriptions.hotelDataForRoom.stop();
      delete subscriptions.hotelDataForRoom;
    }

  }
});

// *********************************************************************

