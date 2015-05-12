// when a reservation request is made, send out a notification

Meteor.startup(function() {
  var emailer = Cluster.discoverConnection('emailService');

  HotelGuestApp.Events.on('order:experience-reservation-requested', function(eventData) {
    var order = Orders.findOne(eventData.orderId);

    // TODO: if notification preference is set, direct to the appropriate channel
    if (order) {
      return emailer.call('sendExperienceReservationRequestedEmail', order);
    }
  });
});


