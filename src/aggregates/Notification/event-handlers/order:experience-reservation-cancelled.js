HotelGuestApp.Events.on('order:experience-reservation-cancelled', function(eventData) {
  var order = Orders.findOne(eventData.orderId);

  // TODO: if notification preference is set, direct to the appropriate channel
  if (order) {
    return Meteor.call('sendExperienceReservationCancelledEmail', order)
  }
});
