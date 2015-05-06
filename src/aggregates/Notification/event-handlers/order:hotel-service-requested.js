// when a hotel service request is made, send out a notification

HotelGuestApp.Events.on('order:hotel-service-requested', function(eventData) {
  var order = Orders.findOne(eventData.orderId);

  // TODO: if notification preference is set, direct to the appropriate channel
  if (order) {
    return Meteor.call('sendHotelServiceRequestedEmail', order);
  }
});
