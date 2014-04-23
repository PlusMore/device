Template.idleOverlay.helpers({
	show: function () {
		return UserStatus.isIdle();
	}
});