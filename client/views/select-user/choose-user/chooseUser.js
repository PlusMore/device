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
    tmpl.step.set('authenticateStayUser');
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
            Accounts.sendResetPasswordEmail(Session.get('onboardAccountCreationUserId'));
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
      }, 1000);

    });
  },
  'create-stay-user-password': function (e, tmpl) {
    var password = e.password;

    var userId = Session.get('selectedUserChoice');
    var user = Meteor.users.findOne(userId);
    var token = user.services.password.reset.token;

    Accounts.resetPassword(token, password, function() {
      tmpl.step.set('chooseUserFinished');
      Meteor.setTimeout(function() {
        tmpl.$(tmpl.firstNode).trigger('choose-user-complete');
      }, 1000);
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

              if (Meteor.isServer) {
                Accounts.sendResetPasswordEmail(Session.get('onboardAccountCreationUserId'));
              }

              tmpl.$(tmpl.firstNode).trigger('onboard-complete');
              return Errors.throw('No password was set for current account. Please follow instructions sent to the email you provided to set a password. Sorry for any inconvenience.');
            }

          }
          return Errors.throw(err.message);
        }

        var user = Meteor.user();

        // update profile information if necessary
        if (e.formData.firstName && (e.formData.firstName !== user.profile.firstName) ) {
          Meteor.users.update(user._id, {$set: {'profile.firstName': e.formData.firstName}})
        }

        if (e.formData.lastName && (e.formData.lastName !== user.profile.lastName) ) {
          Meteor.users.update(user._id, {$set: {'profile.lastName': e.formData.lastName}})
        }


        Meteor.defer(function() {
          // add user to stay
          var device = Devices.findOne(LocalStore.get('deviceId'));
          var room = Rooms.findOne(device.roomId);

          Stays.addUserToStay(room.stayId, function(err, result) {
            if (err) {
              Errors.throw(err.reason);
            }

            tmpl.step.set('chooseUserFinished');

            Meteor.setTimeout(function() {
              tmpl.$(tmpl.firstNode).trigger('choose-user-complete');
            }, 1000);
          });
        });

      });
    } else {
      Accounts.createUser(accountOptions, function(err) {
        if (err) return Errors.throw(err.message);

        Meteor.defer(function() {
          var device = Devices.findOne(LocalStore.get('deviceId'));
          var room = Rooms.findOne(device.roomId);

          Stays.addUserToStay(room.stayId, function(err, result) {
            if (err) {
              Errors.throw(err.reason);
            }

            tmpl.step.set('chooseUserFinished');

            Meteor.setTimeout(function() {
              tmpl.$(tmpl.firstNode).trigger('choose-user-complete');
            }, 1000);
          });
        });

      });
    }


  },
  'choose-user-complete': function(e, tmpl) {
    tmpl.$(tmpl.firstNode).closest('.modal').trigger('hide-modal');
    $(document).trigger('user-selected');

    Meteor.setTimeout(function() {
      modal.close()
      tmpl.step.set(undefined);
      Session.set('selectedUserChoice', undefined);
    }, 1000);

  }
});
