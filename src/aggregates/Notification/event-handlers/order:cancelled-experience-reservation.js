HotelGuestApp.Events.on('order:cancelled-experience-reservation', function(eventData) {
  var order = Orders.findOne(eventData.orderId);

  // TODO: if notification preference is set, direct to the appropriate channel

  return Meteor.call('sendExperienceReservationCancelledEmail', order.reservation)
});
