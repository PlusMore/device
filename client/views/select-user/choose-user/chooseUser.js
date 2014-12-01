Template.chooseUser.created = function () {
  this.step = new ReactiveVar('selectUserFromStay');
};

Template.chooseUser.helpers({
  chooseUserStep: function() {
    return Template.instance().step.get();
  }
});

Template.chooseUser.events({
  'user-selected': function (e, tmpl) {
    tmpl.step.set('loginStayUser');
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
  'choose-user-complete': function() {
    tmpl.$(tmpl.firstNode).closest('.modal').trigger('hide-modal');
    $(document).trigger('user-selected');

    Meteor.setTimeout(function() {
      tmpl.step.set(undefined);
      Session.set('selectedUserChoice', undefined);
    }, 2000);
    
  }
});