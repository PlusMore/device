Template.service.helpers({
  isRequested: function() {
    return (status === 'requested');
  },
  isPending: function() {
    return (status === 'pending');
  },
  isCompleted: function() {
    return (this.status === 'completed');
  },
  isCancelled: function() {
    return (this.status === 'cancelled');
  },
  isCancelable: function() {
    if (this.service.type === 'roomService' && this.status === 'pending'){
      return false;
    }
    return this.open;
  },
  cancelledDateMomentAgo: function() {
    var now = Session.get('currentTime');
    return moment(this.cancelledDate).fromNow();
  },
  requestedDateTimeAgo: function() {
    var now = Session.get('currentTime');
    return moment(this.requestedDate).fromNow();
  },
  orderStatus: function() {
    if (this.status === 'requested') {
      return 'Requested';
    } 

    if (this.status === 'cancelled') {
      return 'Cancelled';
    }

    if (this.status === 'completed') {
      return 'Completed';
    }

    return '(In Progress)';
  },
  friendlyServiceType: function() {
    if (typeof HotelServices.friendlyServiceType === 'function') {
      return HotelServices.friendlyServiceType(this.service.type);
    } else {
      return this.service.type;
    }
  }
});

Template.service.events({
  'click .btn.btn-cancel-request': function(event) {
    event.preventDefault(); 
    if (confirm("Are you sure you want to cancel this service?")) {
      Meteor.call('cancelService', this._id);
    } 
  }
});