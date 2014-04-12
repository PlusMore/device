/* ---------------------------------------------------- +/

## Main ##

Global client-side code. Loads last.

/+ ---------------------------------------------------- */

//

Meteor.startup(function () {
  FastClick.attach(document.body);
  document.body.addEventListener('touchmove', function(event) {
    if (! $(event.target).parents().hasClass("touch-scrollable" ))
    {
      event.preventDefault();
    }
  }, false);
});

Meteor.startup(function() {
  // Initialize Mixpanel Analytics
  mixpanel.init('37f6902be1f2618c7cf2a5b37dbef276'); //YOUR TOKEN
});

Meteor.startup(function() {
  Deps.autorun(function () {
    var deviceId = Session.get('deviceId'),
      device = Devices.findOne(deviceId);

    if (device) {
      Meteor.subscribe('deviceData');
    }
  });
});