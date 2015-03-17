Template.idleOverlay.helpers({
  show: function() {
    return UserStatus.isIdle() ? 'animated fadeIn show' : 'animated fadeOut';
  }
});

Template.idleOverlay.events({
  'click .overlay-idle': function() {
    console.log('clicked');
    UserStatus.pingMonitor();
  },
  'touchstart .overlay-idle': function() {
    console.log('touched');
    UserStatus.pingMonitor();
  }
});
