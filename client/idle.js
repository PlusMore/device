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

      console.log('user went idle');
      if (status === "connecting" || status === "waiting") {
        console.log('attempting to connect');
      } else if (status === "connected") {
        console.log('disconnecting');
        Meteor.disconnect();
      }

    } else {
      
      console.log('user is active');
      if (status === "connecting" || status === "waiting") {
        console.log('attempting to connect');
      } else if (status === "offline") {
        console.log('initiate reconnect');
        Meteor.reconnect();
      }

    }

  });
});