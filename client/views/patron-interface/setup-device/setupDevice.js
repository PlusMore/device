Deps.autorun(function() {
  var user = Meteor.user();
  if (user) {
    if (Roles.userIsInRole(user._id, ['admin', 'hotel-staff'])) {
      Meteor.subscribe('hotelData');
    }
  }  
})

Template.setupDevice.helpers({
  setupDeviceSchema: function() {
    return Schema.setupDevice;
  },
  hotelName: function() {
    return Session.get('hotelName');
  },
  hotelId: function() {
    if (this.hotel) {
      return this.hotel._id;
    }
  }
});

AutoForm.hooks({
  setupDeviceForm: {
    onSuccess: function(operation, deviceId, template) {
      // log out the current hotel staff

      // Session.keys = {};
      Router.go('settingUp');

      Meteor.setTimeout(function() {
        Meteor.logout(function() {
          // attempts to create and login as new device user
          console.log('loggedOut')
          Meteor.loginDevice(deviceId, function(err) {
            if (err) Errors.throw('Device login failed: ' + err);
            Router.go('welcome');
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