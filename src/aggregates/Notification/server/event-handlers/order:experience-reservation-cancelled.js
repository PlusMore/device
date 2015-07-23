Meteor.startup(function() {
  var emailer = Cluster.discoverConnection('emailService');

  HotelGuestApp.Events.on('order:experience-reservation-cancelled', function(eventData) {
    var order = Orders.findOne(eventData.orderId);
    var email = true; // TODO: if notification preference is set, direct to the appropriate channel

    if (order) {
      if (email && emailer) {
        // emailer does not know about these things to keep it in
        // a separate bounded context

        var reservation = order.reservation;
        var experience = Experiences.findOne(reservation.experienceId);

        var when = moment(reservation.date).zone(reservation.zone);
        when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";

        var options = {
          title: experience.title,
          when: when,
          party: {
            name: reservation.partyName,
            size: reservation.partySize
          },
          venue: {
            name: experience.venueName,
            address: _.pick(experience.geo, [
              'streetNumber',
              'streetName',
              'city',
              'stateCode',
              'zipcode',
            ])
          },
          guestContactEmail: reservation.emailAddress,
          contactPhone: experience.phone
        };

        return emailer.call('sendExperienceReservationCancelledEmail', options);
      }
    }
  });
});


