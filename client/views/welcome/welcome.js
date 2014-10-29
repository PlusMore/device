Template.welcome.helpers({
  device: function() {
    if (Meteor.user()) {
      var deviceId = Meteor.user().deviceId;
      return Devices.findOne(deviceId);
    }
  },
  needsRegistration: function() {
    if (Meteor.user()) {
      return !Meteor.user().deviceId;
    }
  },
  hotel: function() {
    return Hotels.findOne();
  }
});

var onEngage = function(e) {
  e.preventDefault();
  App.go();
}

var events = {};
events[clickevent + " #main"] = onEngage;

Template.welcome.events(events);