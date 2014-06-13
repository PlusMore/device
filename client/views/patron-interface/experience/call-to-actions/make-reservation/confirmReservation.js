Template.confirmReservation.helpers({
  needsRegistration: function() {
    return (typeof Meteor.user().emails === 'undefined');
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
  