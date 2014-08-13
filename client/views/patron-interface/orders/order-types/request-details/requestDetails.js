Template.requestDetails.helpers({
  when: function() {
    var options = this.request.options || {};
    if (options && options.date) {
      return moment(this.request.options.date).calendar();
    } else {
      return 'ASAP';
    }
  },
  formattedDate: function() {
    var options = this.request.options || {};
    if (options && options.date) {
      return moment(this.request.options.date).format('MMMM Do, YYYY h:mm a');
    } else {
      return "As Soon As Possible";
    }
  },
  requestTemplate: function() {
    switch (this.request.type) {
      case 'transportation': 
        return 'transportationRequestDetails';
      case 'roomService': 
        return 'roomServiceRequestDetails';
      default:
        return '';
    }
  }
});