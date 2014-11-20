Template.onboardUser.helpers({
  stepOne: function() {
    return Session.equals('onboardStep', 1);
  },
  stepTwo: function() {
    return Session.equals('onboardStep', 2);
  },
  stepThree: function() {
    return Session.equals('onboardStep', 3);
  },
  finished: function() {
    return Session.equals('onboardStep', 'complete');
  }
});

Template.onboardUser.events({
  'onboard-step-one-complete': function(e, tmpl) {
    Session.set('onboardStep', 2);
  },
  'onboard-step-two-complete': function(e, tmpl) {
    Session.set('onboardStep', 3);
  },
  'onboard-step-three-complete': function(e, tmpl) {
    var accountOptions = Session.get('onboardAccountCreationOptions');
    var checkoutDate = accountOptions.checkoutDate;
    accountOptions = _.pick(accountOptions, ['profile', 'email', 'password'])

    Accounts.createUser(accountOptions, function(err) {
      if (err) return Errors.throw(err.message);
      Meteor.call('registerStay', checkoutDate, function() {
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