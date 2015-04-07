/* ---------------------------------------------------- +/

## App Subscriptions ##

In this file we need to set up subscriptions based on various bits of data.

App Subscriptions:
--------
If the application is not in kiosk mode:
1) Get the current user, Meteor.user(), From the user, subscribe to user's stays
2) From the stay, find out what room the user is associated with
3) From the room we can find the Hotel
(User) -> (Stay) -> (Room) -> (Hotel) -> [HotelServices]

------------------------------------------------------- */

// 1) Get the current user, Meteor.user(), From the user, subscribe to user's stays
Tracker.autorun(function() {
  var kiosk = LocalStore.get('kiosk');
  var user = Meteor.user();

  // if not kiosk and user logged in
  if (!kiosk && user) {

    console.log('App Subscriptions - 1) From the user, subscribe to users stays');
    subscriptions.userStays = Meteor.subscribe('userStays', user._id);

  } else {

    if (subscriptions.userStays) {
      console.log('Removing user stays subscriptions')
      subscriptions.userStays.stop();
      delete subscriptions.userStays;
    }

  }
});

// 2) From the stay, find out what room the user is associated with
Tracker.autorun(function() {
  var kiosk = LocalStore.get('kiosk');
  var user = Meteor.user();
  var activeStays = Stays.find({active: true}); // for reactivity
  var stay = Stays.findOne();

  // if not kiosk and user logged in and has stay
  if (!kiosk && user && stay) {

    console.log('App Subscriptions - 2) From the stay, find out what room the user is associated with');
    subscriptions.roomForStay = Meteor.subscribe('roomForStay', stay._id);

  } else {

    if (subscriptions.roomForStay) {
      subscriptions.roomForStay.stop();
      delete subscriptions.roomForStay;
    }

  }
});

// 3) From the room we can find the Hotel
Tracker.autorun(function() {
  var kiosk = LocalStore.get('kiosk');
  var user = Meteor.user();
  var activeStays = Stays.find({active: true});
  var rooms = Rooms.find(); // for reactivity
  var stay = Stays.findOne();
  var roomForStay;

  if (stay) {
    roomForStay = Rooms.findOne({stayId: stay._id});
  }

  // if not kiosk and user logged in and has stay
  if (!kiosk && user && roomForStay) {

    console.log('App Subscriptions - 3) From the room we can find the Hotel');
    subscriptions.hotelForRoom = Meteor.subscribe('hotel', roomForStay.hotelId);

  } else {

    if (subscriptions.hotelForRoom) {
      subscriptions.hotelForRoom.stop();
      delete subscriptions.hotelForRoom;
    }

  }
});
