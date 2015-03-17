Meteor.startup(function() {
  // Start idle time
  Deps.autorun(function() {
    var minutes = 5;
    try {
      UserStatus.startMonitor({
        threshold: (1000 * 60 * minutes),
        idleOnBlur: false
      });
    } catch (_error) {}
  });


  // Start idle time
  Deps.autorun(function() {
    var isIdle = UserStatus.isIdle();
    var status = Meteor.status().status;
    var kiosk = LocalStore.get('kiosk');

    if (isIdle) {

      if (status === "connecting" || status === "waiting") {} else if (status === "connected") {
        App.track("User Idle");

        $('#confirm-reservation').modal('hide');
        Session.set('reservation', null);

        if (kiosk) {
          Meteor.logout();
          Meteor.disconnect();
        }
      }

    } else {
      if (status === "connecting" || status === "waiting") {} else if (status === "offline") {
        Meteor.reconnect();
        App.track("Tap To Resume");
      }
    }
  });
});
