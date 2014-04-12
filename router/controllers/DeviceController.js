DeviceController = RouteController.extend({
  layoutTemplate: 'deviceLayout',
  onBeforeAction: function() {
      Session.set('experienceState', '');
  },
  onData: function() {
    if (Meteor.user()) {
      var deviceId = Meteor.user().deviceId,
          device = Devices.findOne(deviceId);

      if (device)
      {
        Session.set('deviceId', device._id);
      }
    }
  }
});