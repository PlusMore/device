Template.selectGeneric.rendered = function() {
  var selectedService = Session.get('selectedService');
  var hotelService = HotelServices.findOne({
    type: selectedService
  });
  initializeServicePickers(this, hotelService.startMinutes, hotelService.endMinutes);
};

Template.selectGeneric.destroyed = function() {
  destroyServicePickers(this);
};
