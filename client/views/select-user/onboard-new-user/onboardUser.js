Template.onboardUser.helpers({
  onboardStep: function() {
    return Session.get('onboardStep');
  }
});

Template.onboardUser.events({
  'onboard-step-guest-info-complete': function(e, tmpl) {
    var deviceId = LocalStore.get('deviceId');
    var checkoutDate = Session.get('checkoutDate');
    Session.set('loader', 'Verifying');
    Meteor.call('registerStay', deviceId, checkoutDate, function(err, stay) {
      if (err) {
        Session.set('loader', undefined);

        return Errors.throw('Unable to register stay.');
      }
      Session.set('stayId', stay._id);
      Session.set('onboardStep', 'onboardUserGuestNotifications');
      Session.set('loader', undefined);
    });
  },
  'onboard-step-guest-notifications-complete': function(e, tmpl) {
    // check if user exists, if so, send to login, 
    // otherwise send to account creation
    var accountOptions = Session.get('onboardAccountCreationOptions');
    var email = accountOptions.email;

    Meteor.call('doesUserExist', email, function(err, userExists) {
      if (err) return Errors.throw('Something went wrong.');

      if (userExists) {
        Session.set('onboardAccountCreationUserId', userExists);
        Session.set('onboardStep', 'onboardExistingUserGuestPassword');
      } else {
        Session.set('onboardStep', 'onboardUserGuestPassword');
      }
    });
  },
  'onboard-step-guest-password-complete': function(e, tmpl) {
    var accountOptions = Session.get('onboardAccountCreationOptions');
    accountOptions = _.pick(accountOptions, ['profile', 'email', 'password'])

    Accounts.createUser(accountOptions, function(err) {
      if (err) return Errors.throw(err.message);

      var device = Devices.findOne(LocalStore.get('deviceId'));
      var stay = Stays.findOne(device.stayId);

      Meteor.call('addUserToStay', stay._id, function() {
        Session.set('onboardStep', 'complete');
        Meteor.setTimeout(function() {
          tmpl.$(tmpl.firstNode).trigger('onboard-complete');
        }, 2000);
      });
    });
  },
  'onboard-step-existing-guest-password-complete': function(e, tmpl) {
    var accountOptions = Session.get('onboardAccountCreationOptions');

    Meteor.loginWithPassword(accountOptions.email, accountOptions.password, function(err) {
      if (err) {
        if (err.error === 403) {
          if (err.reason === 'User has no password set') {
            Accounts.setResetPasswordEmail(Session.get('onboardAccountCreationUserId'));
            tmpl.$(tmpl.firstNode).trigger('onboard-complete');
            return Errors.throw('No password was set for current account. Please follow instructions sent to the email you provided to set a password. Sorry for any inconvenience.');
          }
        }
        return Errors.throw(err.message);
      }

      var device = Devices.findOne(LocalStore.get('deviceId'));
      var stay = Stays.findOne(device.stayId);

      Meteor.call('addUserToStay', stay._id, function() {
        Session.set('onboardStep', 'complete');
        Meteor.setTimeout(function() {
          tmpl.$(tmpl.firstNode).trigger('onboard-complete');
        }, 2000);
      });
    });
  },
  'onboard-complete': function(e, tmpl) {
    tmpl.$(tmpl.firstNode).closest('.modal').trigger('hide-modal');
    $(document).trigger('user-selected');
    
    Meteor.setTimeout(function() {
      Session.set('onboardStep', undefined);
      Session.get('onboardAccountCreationOptions', undefined);
    }, 2000);
  },
  'onboard-error': function(e, tmpl) {
     tmpl.$(tmpl.firstNode).closest('.modal').trigger('hide-modal');
  }
});