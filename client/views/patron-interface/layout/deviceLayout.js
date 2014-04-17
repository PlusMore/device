Template.deviceLayout.helpers({
  deviceContainerClass: function () {
    var isRegistered = Session.get('deviceIsRegistered')    
    if (isRegistered) {
      var current = Router.current();
      if (current) {
        var devicePage = Router.current().route.name;
        if (devicePage) {
          return devicePage + "-container";
        }
      } else {
        return "";
      }
      
    } else {
      return 'unregistered';
    }
  },
  idleStatus: function() {
    return UserStatus.isIdle() ? 'idle' : ''
  },
  isIdle: function() {
    return UserStatus.isIdle();
  },
  connectionStatus: function () {
    return Meteor.status().status;
  }
});

Template.preload.helpers({
  experiences: function () {
    return Experiences.find();
  }
});