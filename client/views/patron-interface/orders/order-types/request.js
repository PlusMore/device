Template.request.helpers({
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
    return moment(this.request.options.date).calendar();
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

Template.request.events({
  'click .btn.btn-cancel-request': function(event) {
    event.preventDefault(); 
    if (confirm("Are you sure you want to cancel this request?")) {
      Meteor.call('cancelRequest', this._id);
    } 
  }
});