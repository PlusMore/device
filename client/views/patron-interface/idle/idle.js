Template.idleOverlay.helpers({
  show: function () {
		return UserStatus.isIdle() ? 'animated fadeIn show' : 'animated fadeOut';
	}
});

Template.idleOverlay.events({
  'click .overlay-idle': function () {
    UserStatus.pingMonitor();
  }
});