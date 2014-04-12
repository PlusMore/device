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
      Meteor.logout()
      // attempts to create and login as new device user
      Meteor.loginDevice(deviceId, function(err) {
        Router.go('welcome');
      });
    },
    onError: function(operation, error, template) {
      console.log(error);
    }
  }
});

Handlebars.registerHelper("deviceTypes", function() {
  var deviceTypes = [
      'Room',
      'Lobby'
    ],
    deviceOptions = [];

  _.each(deviceTypes, function(deviceType) {
    deviceOptions.push({
      label: deviceType,
      value: deviceType.toLowerCase()
    });
  });

  return deviceOptions;
});
