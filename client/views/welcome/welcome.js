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
  }
});

var onEngage = function(e) {
  e.preventDefault();
  App.go(); // client/lib/app.js
}

var events = {};
events[clickevent + " #main"] = onEngage;

Template.welcomeContent.events(events);