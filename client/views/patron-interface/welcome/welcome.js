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

    var stay = Stays.findOne({userId: Meteor.userId(), active: true});

    if (!stay) {
      Router.go('enterCheckoutDate');
    } else {
      Router.go('experiences', {category: 'Dining'});
    }
		
	}
});