Template.order.helpers({
  isReservation: function() {
    return this.type === 'reservation';
  },
  experience: function() {
    return Experiences.findOne(this.reservation.experienceId);
  },
  needsAction: function() {
    return this.open;
  },
  isPending: function() {
    var status = this.status || 'pending'
    return (status === 'pending');
  },
  isConfirmed: function() {
    return (this.status === 'confirmed' || !!this.confirmationDate);
  },
  isCancelled: function() {
    return (this.status === 'cancelled');
  }
});

Template.order.events({
  'click .btn.cancel-reservation': function(event) {
    event.preventDefault();
    Meteor.call('cancelReservation', this._id);
  }
});