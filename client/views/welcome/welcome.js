Template.welcome.helpers({
  needsRegistration: function() {
    if (Meteor.user()) {
      return !Meteor.user().deviceId;
    }
  }
});

Template.welcomeContent.helpers({
  hotel: function() {
    return Hotels.findOne();
  },
  device: function() {
    return Devices.findOne();
  }
});

var onEngage = function(e) {
  e.preventDefault();
  App.go();
}

var events = {};
events[clickevent + " #main"] = onEngage;

Template.welcomeContent.events(events);