/* ---------------------------------------------------- +/

## Main ##

Global client-side code. Loads last.

/+ ---------------------------------------------------- */

//

window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

Meteor.startup(function () {

  // Initialize Mixpanel Analytics
  if (mixpanel) {
    mixpanel.init(Meteor.settings.public.mixpanel); 
  }
  else {

  }

  window.addEventListener('error', function(errorEvent) {
    // You can view the information in an alert to see things working
    // like so:
    var message = errorEvent.message;
    var fileName = errorEvent.filename;
    var line = errorEvent.lineno;

    App.track('Client Error', {
      "Error Message": message,
      "Error FileName": fileName,
      "Error Line Number": line
    });

    var suppressErrorAlert = true;
    // If you return true, then error alerts (like in older versions of 
    // Internet Explorer) will be suppressed.
    return suppressErrorAlert;
  });

});

Meteor.startup(function() {
  // Subscribe to device data when a device ID is available
  Deps.autorun(function () {
    var user = Meteor.user();

    if (user) {
      var deviceId = user.deviceId || null;

      if (deviceId) {
        var deviceId = Meteor.user().deviceId,
        device = Devices.findOne(deviceId);

        if (device) {
          Meteor.subscribe('deviceData');
        }
      }
    }
    
  });
})