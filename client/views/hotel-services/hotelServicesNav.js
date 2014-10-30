Template.hotelServicesNav.helpers({
  activeHotelServiceClass: function(serviceName) { 
    return Session.get('selectedService') === serviceName ? 'active' : '';
  },
  activeHotelServices: function() {
    var hotelCursor = Hotels.find();
    
    if (hotelCursor.count() > 0) {
      var hotel = Hotels.findOne();
      if (!hotel.hotelServicesEnabled) {
        return false;
      } else {
        return HotelServices.find({hotelId: hotel._id, active: true, type: {$ne: 'roomService'}});
      }
    }
  },
  isValidService: function() {
    return !!HotelServices.friendlyRequestType(this.type);
  },
  friendlyRequestType: function() {
    if (typeof HotelServices.friendlyRequestType === 'function') {
      return HotelServices.friendlyRequestType(this.type);
    } else {
      return this.type;
    }
  }
});

var selectMenuItem = function (e, template) {
  e.preventDefault();
  var templateName = $(e.currentTarget).data('template') || 'hotelServicesDescription';

  Session.set('selectedService', templateName);
}

var events = {};
events[clickevent + " a.menu-item"] = selectMenuItem;

Template.hotelServicesNav.events(events);