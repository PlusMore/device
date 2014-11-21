Template.onboardUser.helpers({
  onboardStep: function() {
    return Session.get('onboardStep');
  }
});

Template.onboardUser.events({
  'onboard-step-guest-info-complete': function(e, tmpl) {
    var deviceId = LocalStore.get('deviceId');
    var checkoutDate = Session.get('checkoutDate');
    // Session.set('loader', 'Verifying');
    // Meteor.call('registerStay', deviceId, checkoutDate, function(err, stay) {
    //   Session.set('onboardStep', 'onboardUserGuestNotifications');
    //   Session.set('loader', undefined);
    // });
      Session.set('onboardStep', 'onboardUserGuestNotifications');

  },
  'onboard-step-guest-notifications-complete': function(e, tmpl) {
    // check if user exists, if so, send to login, 
    // otherwise send to account creation
    var accountOptions = Session.get('onboardAccountCreationOptions');
    var email = accountOptions.email;

    Meteor.call('doesUserExist', email, function(err, userExists) {
      if (err) return Errors.throw('Something went wrong.');

      if (userExists) {
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
      Meteor.call('addUserToStay', function() {
        Session.set('onboardStep', 'complete');
        Meteor.setTimeout(function() {
          tmpl.$(tmpl.firstNode).trigger('onboard-complete');
        }, 2000);
      });
    });
  },
  'onboard-step-existing-guest-password-complete': function(e, tmpl) {
    var accountOptions = Session.get('onboardAccountCreationOptions');
    accountOptions = _.pick(accountOptions, ['profile', 'email', 'password'])

    Accounts.createUser(accountOptions, function(err) {
      if (err) return Errors.throw(err.message);
      Meteor.call('addUserToStay', function() {
        Session.set('onboardStep', 'complete');
        Meteor.setTimeout(function() {
          tmpl.$(tmpl.firstNode).trigger('onboard-complete');
        }, 2000);
      });
    });
  },
  'onboard-complete': function(e, tmpl) {
    $(document).trigger('user-selected');
    hideModal();
    Meteor.setTimeout(function() {
      Session.set('onboardStep', undefined);
    }, 2000);
  }
});