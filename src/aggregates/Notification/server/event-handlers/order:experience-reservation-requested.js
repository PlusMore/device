// when a reservation request is made, send out a notification

Meteor.startup(function() {
  var emailer = Cluster.discoverConnection('emailService');

  HotelGuestApp.Events.on('order:experience-reservation-requested', function(eventData) {
    var order = Orders.findOne(eventData.orderId);
    var email = true;// TODO: if notification preference is set, direct to the appropriate channel

    if (order) {
      if (email && emailer) {
        var orderId = order._id;
        var reservation = order.reservation;
        var experience = Experiences.findOne(reservation.experienceId);

        var adminEndpoint = Cluster.discovery.pickEndpoint('admin');
        var url;

        if (adminEndpoint) {
          url = stripTrailingSlash(adminEndpoint) + "/patron-order/{0}".format(orderId);
        } else {
          url = 'ERROR: Admin endpoint could not be reached. The url could not be generated. Please login to the admin application and search for the order.';
        }

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
          contactPhone: experience.phone,
          adminOrderUrl: url
        };

        return emailer.call('sendExperienceReservationRequestedEmail', options);
      }
    }
  });
});


