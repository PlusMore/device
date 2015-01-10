Template.confirmReservation.helpers({
  needsRegistration: function() {
    if (Meteor.user()) {
      return (typeof Meteor.user().emails === 'undefined');
    }
  },
  reservation: function() {
    return Session.get('reservation');
  },
  fullName: function() {
    if (Meteor.user() && Meteor.user().profile) {
      return Meteor.user().profile.name;
    }
  },
  emailAddress: function() {
    return Meteor.user().emails[0].address;
  },
  when: function() {
    var reservation = Session.get('reservation');
    if (reservation)
      return moment(reservation.date).zone(reservation.zone).calendar();
  }
});

Template.confirmReservation.events({
  'click .btn-default': function(e) {
    e.preventDefault();
    
    var reservation = Session.get('reservation');
        
    
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