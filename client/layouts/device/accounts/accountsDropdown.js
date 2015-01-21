Template.accountsDropdown.helpers({
  dropdownText: function () {
    var user = Meteor.user();

    if (LocalStore.get('kiosk')) {
      if (user) {
        if (user.profile && user.profile.firstName && user.profile.lastName) {
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
    } else {
      if (user) {
        if (user.profile && user.profile.firstName && user.profile.lastName) {
          return "{0} {1}".format(user.profile.firstName, user.profile.lastName);
        }

        return "Account";
      }
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

Template.accountsDropdown.events({
  'click #accounts-dropdown-button': function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (Session.get('animatingMenu')) {
      return;
    }
    
    if (Meteor.user()) {
      Session.set('accountInfo', true);
    } else {
      Session.set('selectUser', true);
    }
  },
  'click .js-logout': function () {
    return Meteor.logout();
  }
});