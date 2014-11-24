Template.accountsDropdown.helpers({
  dropdownText: function () {
    var user = Meteor.user();

    if (user) {
      if (user.profile) {
        return "{0} {1}".format(user.profile.firstName, user.profile.lastName);
      }
    }

    var deviceId = LocalStore.get('deviceId');

    if (deviceId) {
      var device = Devices.findOne(deviceId);
      if (device)
        return device.location;
    } else {
      return 'Sign in';
    }
  },
  deviceLocation: function () {
    var deviceId = LocalStore.get('deviceId');
    if (deviceId) {
      var device = Devices.findOne(deviceId);
      if (device)
        return device.location;
    }
  },
  users: function() {
    var stayId = Session.get('stayId');
    return Meteor.users.find({stayId: stayId});
  }
});

Template.accountsDropdown.helpers({
  'click .js-logout': function () {
    return Meteor.logout();
  }
});