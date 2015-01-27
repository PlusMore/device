Template.reservation.helpers({
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
    var status = this.status || 'pending';
    return (status === 'pending');
  },
  isConfirmed: function() {
    return (this.status === 'confirmed' || !!this.confirmationDate);
  },
  isCancelled: function() {
    return (this.status === 'cancelled');
  },
  cancelledDateMomentAgo: function() {
    var now = Session.get('currentTime');
    return moment(this.cancelledDate).fromNow();
  },
  requestedDateTimeAgo: function() {
    var now = Session.get('currentTime');
    return moment(this.requestedAt).fromNow();
  },
  when: function() {
    var when = moment(this.reservation.date).zone(this.reservation.zone || moment().zone());
    when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";
    return when;
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

Template.reservation.events({
  'click .btn.btn-cancel-reservation': function(event) {
    event.preventDefault(); 
    if (confirm("Are you sure you want to cancel this reservation?")) {
      Meteor.call('cancelReservation', this._id);
    } 
  }
});