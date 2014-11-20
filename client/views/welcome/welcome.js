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
    if (Meteor.user()) {
      var deviceId = Meteor.user().deviceId;
      return Devices.findOne(deviceId);
    }
  }
});

var onEngage = function(e) {
  e.preventDefault();
  App.go();
}

var events = {};
events[clickevent + " #main"] = onEngage;

Template.welcomeContent.events(events);