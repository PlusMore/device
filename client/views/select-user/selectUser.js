Template.selectUser.helpers({
  isVisibleClass: function() {
    if (!!Session.get('selectUser')) {
      
      if (Session.get('hideSelectUser')) {
        return 'show in animated fadeOut';
      }

      // became visible, set to first step
      if (!Meteor.user()) {
        Session.set('onboardStep', 1);
      }
      
      return 'show in animated fadeIn';
    } else {
      return 'hidden';
    }
  }, 
  hasStay: function() {
    return !!Session.get('stayId');
  },
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

var hideModal = function() {
  Session.set('hideSelectUser', true);
  Meteor.setTimeout(function() {
    Session.set('selectUser', undefined);
    Session.set('hideSelectUser', false);
  }, 500);
}

Template.selectUser.events({
  'click [data-dismiss="modal"]':function(e, tmpl){
    console.log('dismiss');

    hideModal();
    $(document).trigger('cancel-user-selected');
    
  
  }, 
  'click #btn-step-one': function(e, tmpl) {
    // validate
    var firstName = tmpl.$('[name=firstName]').val();
    var lastName = tmpl.$('[name=lastName]').val();
    var checkoutDate = tmpl.$('[name=checkoutDate]').val();

    Session.set('onboardAccountCreationOptions', {
      profile: {
        firstName: firstName,
        lastName: lastName
      },
      checkoutDate: checkoutDate
    });

    tmpl.$(tmpl.firstNode).trigger('onboard-step-one-complete');
    
  },
  'onboard-step-one-complete': function(e, tmpl) {
    // create
    Session.set('onboardStep', 2);
  },
  'click #btn-step-two': function(e, tmpl) {
    //validate
    var email = tmpl.$('[name=email]').val();

    var accountOptions = Session.get('onboardAccountCreationOptions');

    accountOptions = _.extend(accountOptions, {
      email: email
    });
    Session.set('onboardAccountCreationOptions', accountOptions);

    tmpl.$(tmpl.firstNode).trigger('onboard-step-two-complete');
    
  },
  'onboard-step-two-complete': function(e, tmpl) {
    Session.set('onboardStep', 3);
  },
  'click #btn-step-three': function(e, tmpl) {
    // validate
    var password = tmpl.$('[name=password]').val();

    var accountOptions = Session.get('onboardAccountCreationOptions');

    accountOptions = _.extend(accountOptions, {
      password: password
    });
    Session.set('onboardAccountCreationOptions', accountOptions);

    tmpl.$(tmpl.firstNode).trigger('onboard-step-three-complete');
    
  },
  'onboard-step-three-complete': function(e, tmpl) {
    var accountOptions = Session.get('onboardAccountCreationOptions');
    var checkoutDate = accountOptions.checkoutDate;
    accountOptions = _.pick(accountOptions, ['profile', 'email', 'password'])

    Accounts.createUser(accountOptions, function() {
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