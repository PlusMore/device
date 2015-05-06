HotelGuestApp.Events.on('order:cancelled-experience-reservation', function(eventData) {
  var order = Orders.findOne(eventData.orderId);

  // TODO: if notification preference is set, direct to the appropriate channel
  if (order) {
    return Meteor.call('sendExperienceReservationCancelledEmail', order)
  }
});
