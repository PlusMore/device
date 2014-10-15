Template.requestDetails.helpers({
  when: function() {
    var request = this.request || {};
    var zone = request.zone || Session.get('zone');
    if (request && request.date) {
      return moment(request.date).zone(zone).calendar();
    } else if (request && request.options && request.options.date) {
      // old version - deprecated
      return moment(request.options.date).zone(zone).calendar();
    } else {
      return 'ASAP';
    }
  },
  formattedDate: function() {
    var options = this.request.options || {};
    var request = this.request || {};
    var zone = request.zone || Session.get('zone');
    if (request && request.date) {
      return moment(request.date).zone(zone).format('MMMM Do, YYYY h:mm a');
    } else if (options && options.date) {
      // deprecated
      return moment(options.date).format('MMMM Do, YYYY h:mm a');
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