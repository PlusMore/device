/* ---------------------------------------------------- +/

## Main ##

Global client-side code. Loads last.

/+ ---------------------------------------------------- */

//

Meteor.startup(function () {

  // Add FastClick
  FastClick.attach(document.body);


  // Allow touch scrolling on .touch-scrollable elements
  document.body.addEventListener('touchmove', function(event) {
    if (! $(event.target).parents().hasClass("touch-scrollable" ))
    {
      event.preventDefault();
    }
  }, false);


  // Initialize Mixpanel Analytics
  mixpanel.init('37f6902be1f2618c7cf2a5b37dbef276'); //YOUR TOKEN


  // Subscribe to device data when a device ID is available
  Deps.autorun(function () {
    var deviceId = Session.get('deviceId'),
      device = Devices.findOne(deviceId);

    if (device) {
      Meteor.subscribe('deviceData');
    }
  });

});
