Session.setDefault('loader', 'Loading');

// Set loading screen to notify user of different connection statuses 
Meteor.startup(function() {
  Tracker.autorun(function() {
    var status = Meteor.status().status;

    if (status === "connecting") {
      Session.set('loader', 'Connecting to Server');
    } else if (status === "waiting") {
      Session.set('loader', 'Please Wait...');
    } else if (status === "connected") {
      Session.set('loader', undefined);
    }
  });

  Tracker.autorun(function() {
    var loggingIn = Meteor.loggingIn();

    if (loggingIn) {
      Session.set('loader', 'Logging In');
    } else {
      Session.set('loader', undefined);
    }
  });
});
