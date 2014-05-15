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
  },
  cancelledDateMomentAgo: function() {
    return moment(this.cancelledDate).fromNow();
  },
  requestedDateTimeAgo: function() {
    return moment(this.requestedAt).fromNow();
  },
  when: function() {
    return moment(this.reservation.dateDatetime).calendar();
  },
  orderStatus: function() {
    if (this.status === 'confirmed') {
      return 'Confirmed';
    } 

    if (this.status === 'cancelled') {
      return 'Cancelled';
    }

    return '(In Progress)';
  }
});

Template.order.events({
  'click .btn.btn-cancel-reservation': function(event) {
    event.preventDefault(); 
    if (confirm("Are you sure you want to cancel this reservation?")) {
      Meteor.call('cancelReservation', this._id);
    } 
  }
});