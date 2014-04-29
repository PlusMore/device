Meteor.startup(function () {
  // Start idle time
  Deps.autorun(function() {
    var minutes = 2;
    try {
      UserStatus.startMonitor({
        threshold: (1000*60*minutes),
        idleOnBlur: false
      });
    } catch (_error) {}
  });

  
    // Start idle time
  Deps.autorun(function() {
    var isIdle = UserStatus.isIdle();
    var status = Meteor.status().status;

    if (isIdle) {
      if (status === "connecting" || status === "waiting") {
      } else if (status === "connected") {
        App.track("User Idle");
        Meteor.disconnect();
      }

    } else {
      if (status === "connecting" || status === "waiting") {
      } else if (status === "offline") {
        Meteor.reconnect();
        App.track("Tap To Resume");
        var stay = Stays.findOne({userId: Meteor.userId(), active: true});
        if (!stay) {
          Router.go('welcome');
        } else if (stay.checkoutDate < new Date()) {
          Meteor.call('endStay', stay, function (err, deviceId) {
            if (err) throw new Meteor.Error(err)
            console.log('deviceId', deviceId);
            Meteor.logout();

            Meteor.loginDevice(deviceId, function(err) {
              Router.go('welcome');
            });
          });
        }
      }

    }

  });
});