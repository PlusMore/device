Template.idleOverlay.helpers({
	// isVisible: function () {
 //    return UserStatus.isIdle() ? 'visible' : '';
 //  },
  show: function () {
		return UserStatus.isIdle() ? 'animated fadeIn show' : 'animated fadeOut';
	}
});