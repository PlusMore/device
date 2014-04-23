DeviceController = RouteController.extend({
  layoutTemplate: 'deviceLayout',
  onBeforeAction: function() {
      Session.set('experienceState', '');
  },
  onRun: function () {
    var section = Router.current().route.name;
    Session.set('section', section.toLowerCase());
  },
  action: function() {
  }
});