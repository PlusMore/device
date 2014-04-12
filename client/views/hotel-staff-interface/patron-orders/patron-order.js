Template.patronOrder.helpers({
  isReservation: function() {
    return this.type === 'reservation';
  },
  experience: function() {
    return Experiences.findOne(this.reservation.experienceId);
  },
  needsConfirmation: function() {
    return this.open;
  }
});

Template.patronOrder.events({
  'click .btn.confirm-reservation': function(event) {
    event.preventDefault();
    Meteor.call('confirmPatronReservation', this._id);
  }
});