Template.idleOverlay.helpers({
  show: function () {
		return UserStatus.isIdle() ? 'animated fadeIn show' : 'animated fadeOut';
	}
});