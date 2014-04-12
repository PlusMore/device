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
  }
});

Template.preload.helpers({
  experiences: function () {
    return Experiences.find();
  }
});