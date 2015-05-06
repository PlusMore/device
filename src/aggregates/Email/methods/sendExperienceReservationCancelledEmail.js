Meteor.methods({
  'sendExperienceReservationCancelledEmail': function(reservation) {
    this.unblock();
    if (Meteor.server) {
      var experience = Experiences.findOne(reservation.experienceId);
      var when = moment(reservation.date).zone(reservation.zone);
      when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";

      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: 'noreply@plusmoretablets.com',
        subject: 'Cancelled - Reservation for {0}'.format(experience.title),
        text: "Reservation for {0} has been cancelled.\n\n".format(experience.title) +
          "Reservation Details:\n\n" +
          "For: {0}\n".format(experience.title) +
          "When: {0}\n".format(when) +
          "Name: {0}\n".format(reservation.partyName) +
          "Party Size: {0}\n".format(reservation.partySize) +
          "Email: {0}\n".format(reservation.emailAddress) +
          "\nVenue Info\n" +
          "\n{0}".format(experience.venueName) +
          "\n{0}".format(experience.street) +
          "\n{0}, {1} {2}".format(experience.city, experience.state, experience.zip) +
          "\n{0}".format(experience.phone)
      });
    }
  }
});
