Template.accountsDropdown.helpers({
  dropdownText: function() {
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
        if (device) {
          return device.location;
        } else {
          return 'Unregistered Kiosk'
        }

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

    return 'Account';
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
    var stays = Stays.find();
    var stay = Stays.findOne();
    var stayId = stay && stay._id;
    return Meteor.users.find({
      stayId: stayId
    });
  }
});

Template.accountsDropdown.events({
  'click #accounts-dropdown-button': function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (Session.get('animatingMenu')) {
      return;
    }

    // if user somehow gets here, when they click unregistered kiosk, just reset everything.
    if (LocalStore.get('kiosk')) {
      // if no device id or can't find device for id
      var deviceId = LocalStore.get('deviceId');
      if (!deviceId) {
        LocalStore.set('kiosk', null);
        Menu.hide();
        return;
      }
      if (deviceId && !Devices.findOne(deviceId)) {
        LocalStore.set('kiosk', null);
        LocalStore.set('deviceId', null);
        Menu.hide();
        return;
      }
    }

    if (Meteor.user()) {
      modal.show('accountInfo');
    } else {
      modal.show('selectUser');
    }
  },
  'click .js-logout': function() {
    return Meteor.logout();
  }
});
