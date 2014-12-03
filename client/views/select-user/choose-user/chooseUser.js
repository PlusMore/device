Template.chooseUser.created = function () {
  this.step = new ReactiveVar('selectUserFromStay');
};

Template.chooseUser.helpers({
  chooseUserStep: function() {
    return Template.instance().step.get();
  }
});

Template.chooseUser.events({
  'user-choice-selected': function (e, tmpl) {
    tmpl.step.set('loginStayUser');
  },
  'new-guest-selected': function (e, tmpl) {
    tmpl.step.set('addNewGuest');
  },
  'login-stay-user': function (e, tmpl) {
    var password = e.password;

    var user = {
      id: Session.get('selectedUserChoice')
    }

    Meteor.loginWithPassword(user, password, function(err) {
      if (err) {

        if (err.error === 403) {

          if (err.reason === "Incorrect password") {
            return Errors.throw(err.reason);
          }

          if (err.reason === 'User has no password set') {
            Accounts.setResetPasswordEmail(Session.get('onboardAccountCreationUserId'));
            tmpl.$(tmpl.firstNode).trigger('onboard-complete');
            return Errors.throw('No password was set for current account. Please follow instructions sent to the email you provided to set a password. Sorry for any inconvenience.');
          }

        }
        return Errors.throw(err.message);
      }

      // logged in
      tmpl.step.set('chooseUserFinished');
      Meteor.setTimeout(function() {
        tmpl.$(tmpl.firstNode).trigger('choose-user-complete');
      }, 2000);
      
    });
  },
  'add-new-user': function (e, tmpl) {
    var accountOptions = {
      email: e.formData.emailAddress,
      password: e.formData.password,
      profile: {
        firstName: e.formData.firstName,
        lastName: e.formData.lastName
      }
    };

    if (e.accountExists) {
      Meteor.loginWithPassword(accountOptions.email, accountOptions.password, function(err) {
        if (err) {

          if (err.error === 403) {

            if (err.reason === "Incorrect password") {
              return Errors.throw(err.reason);
            }

            if (err.reason === 'User has no password set') {
              Accounts.setResetPasswordEmail(Session.get('onboardAccountCreationUserId'));
              tmpl.$(tmpl.firstNode).trigger('onboard-complete');
              return Errors.throw('No password was set for current account. Please follow instructions sent to the email you provided to set a password. Sorry for any inconvenience.');
            }

          }
          return Errors.throw(err.message);
        }

        // update profile information if necessary

        // add user to stay
        var device = Devices.findOne(LocalStore.get('deviceId'));
        var stay = Stays.findOne(device.stayId);

        Meteor.call('addUserToStay', stay._id, function() {
          Session.set('onboardStep', 'onboardUserFinished');
          Meteor.setTimeout(function() {
            tmpl.$(tmpl.firstNode).trigger('onboard-complete');
          }, 2000);
        });

      });
    } else {
      Accounts.createUser(accountOptions, function(err) {
        if (err) return Errors.throw(err.message);

        var device = Devices.findOne(LocalStore.get('deviceId'));
        var stay = Stays.findOne(device.stayId);

        Meteor.call('addUserToStay', stay._id, function() {
          Session.set('onboardStep', 'onboardUserFinished');
          Meteor.setTimeout(function() {
            tmpl.$(tmpl.firstNode).trigger('onboard-complete');
          }, 2000);
        });
      });  
    }

    
  },
  'choose-user-complete': function(e, tmpl) {
    tmpl.$(tmpl.firstNode).closest('.modal').trigger('hide-modal');
    $(document).trigger('user-selected');

    Meteor.setTimeout(function() {
      tmpl.step.set(undefined);
      Session.set('selectedUserChoice', undefined);
    }, 2000);
    
  }
});