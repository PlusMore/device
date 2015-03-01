Template.serviceDetails.helpers({
  when: function() {
    var service = this.service || {};
    var zone = service.zone || Session.get('zone');
    if (service && service.date) {
      return moment(service.date).zone(zone).calendar();
    } else if (service && service.options && service.options.date) {
      // old version - deprecated
      return moment(service.options.date).zone(zone).calendar();
    } else {
      return 'ASAP';
    }
  },
  formattedDate: function() {
    var options = this.service.options || {};
    var service = this.service || {};
    var zone = service.zone || Session.get('zone');
    if (service && service.date) {
      return moment(service.date).zone(zone).format('MMMM Do, YYYY h:mm a');
    } else if (options && options.date) {
      // deprecated
      return moment(options.date).format('MMMM Do, YYYY h:mm a');
    } else {
      return "As Soon As Possible";
    }
  },
  serviceTemplate: function() {
    switch (this.service.type) {
      case 'transportation': 
        return 'transportationServiceDetails';
      case 'roomService': 
        return 'roomServiceDetails';
      case 'valetServices': 
        return 'valetServiceDetails';
      default:
        return '';
    }
  }
});