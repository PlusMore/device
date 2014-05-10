Template.idleOverlay.helpers({
	show: function () {
		return UserStatus.isIdle();
	}
});

Template.idleOverlay.events({
  'click idle-overlay': function () {
    return true;
  }
})