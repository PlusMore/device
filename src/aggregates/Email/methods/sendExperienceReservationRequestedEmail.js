Meteor.methods({
  sendExperienceReservationRequestedEmail: function(order) {
    this.unblock();

    if (Meteor.isServer) {
      var orderId = order._id;
      var reservation = order.reservation;
      var experience = Experiences.findOne(reservation.experienceId);

      var url = stripTrailingSlash(Meteor.settings.apps.admin.url) + "/patron-order/{0}".format(orderId);
      var when = moment(reservation.date).zone(reservation.zone);
      when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";

      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: "noreply@plusmoretablets.com",
        subject: "Reservation Request\n\n",
        text: "Reservation Details:\n\n" +
          "For: {0}\n".format(experience.title) +
          "When: {0}\n".format(when) +
          "Name: {0}\n".format(reservation.partyName) +
          "Party Size: {0}\n".format(reservation.partySize) +
          "Email: {0}\n".format(reservation.emailAddress) +
          "\n" +
          "Venue Info\n\n" +
          "{0}\n".format(experience.venueName) +
          "{0} {1}\n".format(experience.geo.streetNumber, experience.geo.streetName) +
          "{0}, {1} {2}\n".format(experience.geo.city, experience.geo.state, experience.geo.zipcode) +
          "{0}\n".format(experience.phone) +
          "\nTo respond to this request, click the link below\n\n" +
          url
      });
    }
  }
});
