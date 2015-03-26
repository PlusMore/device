Template.welcome.helpers({
  needsRegistration: function() {
    return !LocalStore.get('deviceId');
  }
});

Template.welcomeContent.helpers({
  hotel: function() {
    return Hotels.findOne();
  },
  device: function() {
    return Devices.findOne();
  },
  welcomeToName: function() {
    var hotel = Hotels.findOne();

    if (hotel) {
      return "@" + hotel.name;
    }
    return "";
  },
  city: function() {
    var hotel = Hotels.findOne();

    if (hotel) {
      return hotel.geo.city;
    }

    return "Your City";
  }
});

var onEngage = function(e) {
  console.log('Welcome' , e);
  e.preventDefault();
  if (Session.get('animatingMenu')) {
    return;
  }

  if (!Menu.isOpen()) {
    console.log('show menu');
    e.stopImmediatePropagation();
    Menu.show();
  }
};

Template.welcomeContent.events({
  'touchstart #main, click #main': function(e, tmpl) {
    console.log('meteor DOM event');
    fastTouchEvent(onEngage, e, tmpl);
  }
});
