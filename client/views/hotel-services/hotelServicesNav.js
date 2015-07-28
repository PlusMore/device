Template.hotelServicesNav.onRendered(function() {
  if (ResponsiveHelpers.isXs()) {
    this.$('.navbar-toggle').click()
  }
});

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
        return HotelServices.find({
          hotelId: hotel._id,
          active: true,
          type: {
            $ne: 'roomService'
          }
        });
      }
    }
  },
  isValidService: function() {
    return !!HotelServices.friendlyServiceType(this.type);
  },
  friendlyServiceType: function() {
    if (typeof HotelServices.friendlyServiceType === 'function') {
      return HotelServices.friendlyServiceType(this.type);
    } else {
      return this.type;
    }
  }
});

var selectMenuItem = function(e, template) {
  e.preventDefault();
  e.stopImmediatePropagation();
  var templateName = $(e.currentTarget).data('template') || 'hotelServicesDescription';
  Session.set('selectedService', templateName);

  // collapse on mobile
  var $collapsecontainer = $(e.currentTarget).parents('.navbar-collapse:first');
  if ($collapsecontainer.hasClass('in')) {
    $collapsecontainer.collapse('toggle');
  }

  return false;
};

var events = {};
events[clickevent + " a.menu-item"] = selectMenuItem;

Template.hotelServicesNav.events(events);
