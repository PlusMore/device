Template.welcome.helpers({
  device: function() {
    var deviceId = Meteor.user().deviceId;
    return Devices.findOne(deviceId);
  }
});

Template.welcome.events({
	'click .welcome-container': function (e) {
		e.preventDefault();

    App.track('First Use');

		Router.go('enterCheckoutDate');
	}
});