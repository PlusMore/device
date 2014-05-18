Template.welcome.helpers({
  device: function() {
    var deviceId = Meteor.user().deviceId;
    return Devices.findOne(deviceId);
  }
});

Template.welcome.events({
  'click .welcome': function (e) {
    e.preventDefault();
    nextAnimation = 'up';
    setupAnimation = nextAnimation;
    App.begin();
  }
});