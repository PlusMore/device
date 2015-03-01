Template.reservation.helpers({
  isReservation: function() {
    return this.type === 'reservation';
  },
  experience: function() {
    return Experiences.findOne(this.reservation.experienceId);
  },
  isPending: function() {
    return (status === 'pending' || status === 'requested');
  },
  isConfirmed: function() {
    return (this.status === 'confirmed');
  },
  isCancelled: function() {
    return (this.status === 'cancelled');
  },
  isExpired: function() {
    return (this.status === 'expired');
  },
  cancelledDateMomentAgo: function() {
    var now = Session.get('currentTime');
    return moment(this.cancelledDate).fromNow();
  },
  requestedDateTimeAgo: function() {
    var now = Session.get('currentTime');
    return moment(this.requestedDate).fromNow();
  },
  when: function() {
    var when = moment(this.reservation.date).zone(this.reservation.zone || moment().zone());
    when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";
    return when;
  },
  orderStatus: function() {
    if (this.status === 'requested' || this.status === 'pending') {
      return '(In Progress)';
    } 

    if (this.status === 'cancelled') {
      return 'Cancelled';
    }

    if (this.status === 'confirmed') {
      return 'Confirmed';
    }

    if (this.status === 'expired') {
      return 'Expired';
    }
  },
});

Template.reservation.events({
  'click .btn.btn-cancel-reservation': function(event) {
    event.preventDefault(); 
    if (confirm("Are you sure you want to cancel this reservation?")) {
      Meteor.call('cancelReservation', this._id);
    } 
  },
  'click .btn.btn-call-to-cancel': function(event) {
    event.preventDefault(); 
    experience = Experiences.findOne(this.reservation.experienceId);
    modal.show('reservationCallToCancelModal', experience);
  }
});

Template.reservationCallToCancelModal.events({
  'click [data-dismiss="modal"]':function(e, tmpl){
    e.preventDefault();
    e.stopImmediatePropagation();
    modal.close();
  },
});