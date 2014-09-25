Template.selectDateAndTime.rendered = function () {
  var selectedService = Session.get('selectedService');
  var hotelService = HotelServices.findOne({type: selectedService});
  initializeServicePickers(this, hotelService.startMinutes, hotelService.endMinutes);
};

Template.selectDateAndTime.destroyed = function () {
  destroyServicePickers(this);
};