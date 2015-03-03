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
  e.preventDefault();
  if (Session.get('animatingMenu')) {
    return;
  }

  if (!Menu.isOpen()) {
    e.stopImmediatePropagation();
    Menu.show();
  }
};

var events = {};
events[clickevent + " #main"] = onEngage;

Template.welcomeContent.events(events);
