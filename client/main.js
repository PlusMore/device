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
        var device = Devices.findOne(deviceId);

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

  Deps.autorun(function() {
    var stays = Stays.find();
    if (stays.count() > 0) {
      Session.set('stayId', Stays.findOne()._id);
    }
  });

  $(document).on('touchstart', '.icon-menu', function(e) {
    e.preventDefault();
    if (!App.isMenuOpen()) {
      e.stopImmediatePropagation();
      App.showMenu();
    }
  });
  $(document).on('click', '.icon-menu', function(e) {
    e.preventDefault();
    if (!App.isMenuOpen()) {
      e.stopImmediatePropagation();
      App.showMenu();
    }
  });
});


$(window).load(function(){
  $('.preloader').fadeOut(1000); // set duration in brackets
});