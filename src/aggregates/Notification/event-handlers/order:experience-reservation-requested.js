// when a reservation request is made, send out a notification

HotelGuestApp.Events.on('order:experience-reservation-requested', function(eventData) {
  var order = Orders.findOne(eventData.orderId);

  // TODO: if notification preference is set, direct to the appropriate channel
  if (order) {
    return Meteor.call('sendExperienceReservationRequestedEmail', order);
  }
});


