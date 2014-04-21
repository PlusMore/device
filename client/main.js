/* ---------------------------------------------------- +/

## Main ##

Global client-side code. Loads last.

/+ ---------------------------------------------------- */

//

window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

Meteor.startup(function () {

  // Add FastClick
  // FastClick.attach(document.body);


  // // Allow touch scrolling on .touch-scrollable elements
  // document.body.addEventListener('touchmove', function(event) {
  //   if (! $(event.target).parents().hasClass("touch-scrollable" ))
  //   {
  //     event.preventDefault();
  //   }
  // }, false);


  // Initialize Mixpanel Analytics
  if (mixpanel) {
    mixpanel.init(Meteor.settings.public.mixpanel); 
  }
  else {

  }

  // Subscribe to device data when a device ID is available
  Deps.autorun(function () {
    var deviceId = Session.get('deviceId'),
      device = Devices.findOne(deviceId);

    if (device) {
      Meteor.subscribe('deviceData');
    }
  });

});
