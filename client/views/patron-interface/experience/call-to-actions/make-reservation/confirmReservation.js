Template.confirmReservation.helpers({
  needsRegistration: function() {
    if (Meteor.user()) {
      return (typeof Meteor.user().emails === 'undefined');
    }
  }
});

Template.needsRegistrationContent.helpers({
  reservation: function() {
    return Session.get('reservation');
  },
  accountInfo: function () {
    return Schema.accountInfo;
  }
});

Template.registeredContent.helpers({
  reservation: function() {
    return Session.get('reservation');
  }
});

Template.registeredContent.events({
  'click .btn-primary': function(e) {
    e.preventDefault();
    
    var reservation = Session.get('reservation');
    reservation.experienceId = Session.get('currentExperienceId');
        
    Meteor.call('makeReservation', reservation, function(err, result) {
      if (err) {
        Errors.throw(err.toString());
        return;
      }
      $('#confirm-reservation').modal('hide');
      AutoForm.resetForm('accountInfoForReservation');
      Session.set('reservation', null);
      Router.go('orders');
    });
  }
});
  
Meteor.startup(function() {
  AutoForm.hooks({
    accountInfoForReservation: {
      onSuccess: function(operation, result, template) {
        $('#confirm-reservation').modal('hide');
        AutoForm.resetForm('accountInfoForReservation');

        var reservation = Session.get('reservation');
        reservation.experienceId = Session.get('currentExperienceId');
        Meteor.call('makeReservation', reservation, function(err, result) {
          if (err) Errors.throw(err.toString());
          
          Session.set('reservation', null);
          Router.go('orders');
        });
      },
      onError: function(operation, error, template) {
        if (error.error) {
          Errors.throw(error.error);
          App.track('Submit Error', error);
        }
      }
    }
  });
});