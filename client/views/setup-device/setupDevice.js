Deps.autorun(function() {
  var user = Meteor.user();
  if (user) {
    if (Roles.userIsInRole(user._id, ['admin', 'hotel-staff', 'hotel-manager'])) {
      Meteor.subscribe('hotelData');
    }
  }  
});

Template.setupDeviceForm.helpers({
  setupDeviceSchema: function() {
    return Schema.setupDevice;
  }
});

AutoForm.hooks({
  setupDeviceForm: {
    onSuccess: function(operation, deviceId, template) {
      // log out the current hotel staff

      // Session.keys = {};
      // Router.go('settingUp');
      Session.set('loader', 'Registering Device');

      Meteor.setTimeout(function() {
        Meteor.logout(function() {
          // attempts to create and login as new device user
          Meteor.loginDevice(deviceId, function(err) {
            if (err) {
              Session.set('loader', undefined);
              return Errors.throw('Device login failed: ' + err);
            }
            Router.go('welcome');
            Session.set('loader', undefined);
          });
        });
      }, 1000);
      
    },
    onError: function(operation, error, template) {
      if (error.reason) Errors.throw(error.reason);
    }
  }
});


Handlebars.registerHelper("hotelOptions", function() {
  var hotels = Hotels.find().fetch();
  var hotelOptions = [];

  _.each(hotels, function(hotel) {
    hotelOptions.push({
      label: hotel.name,
      value: hotel._id
    });
  });

  return hotelOptions;
});