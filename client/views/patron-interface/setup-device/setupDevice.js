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
        console.log('go to welcome from setupDevice');
        Router.go('welcome');
      });
    },
    onError: function(operation, error, template) {
      console.log(error);
    }
  }
});
