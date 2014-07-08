Template.hotelServices.helpers({
  subNavContentTemplate: function () {
    return Session.get('subNavContentTemplate');
  },
  activeHotelServiceClass: function(serviceName) { 
    return Session.get('subNavContentTemplate') === serviceName ? 'active' : '';
  }
});

Template.hotelServices.events({
  'click a.menu-item': function (e, template) {
    e.preventDefault();
    var templateName = $(e.currentTarget).data('template') || 'hotelServicesDescription';

    Session.set('subNavContentTemplate', templateName);
  }
});