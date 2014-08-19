Template.request.helpers({
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
  orderStatus: function() {
    if (this.status === 'confirmed') {
      return 'Confirmed';
    } 

    if (this.status === 'cancelled') {
      return 'Cancelled';
    }

    return '(In Progress)';
  },
  friendlyRequestType: function() {
    if (typeof HotelServices.friendlyRequestType === 'function') {
      return HotelServices.friendlyRequestType(this.request.type);
    } else {
      return this.request.type;
    }
  }
});

Template.request.events({
  'click .btn.btn-cancel-request': function(event) {
    event.preventDefault(); 
    if (confirm("Are you sure you want to cancel this request?")) {
      Meteor.call('cancelRequest', this._id);
    } 
  }
});