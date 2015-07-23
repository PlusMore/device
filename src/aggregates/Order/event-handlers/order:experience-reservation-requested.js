// when a reservation is made, if the user who did so has a current stay, add that
// data to the order

HotelGuestApp.Events.on('order:experience-reservation-requested', function(eventData) {
  var order = Orders.findOne(eventData.orderId);

  if (order) {
    return Meteor.call('denormalizeHotelDataForExperienceReservationRequest', order)
  }
});
