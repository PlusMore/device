Meteor.methods({
  makeReservation: function(reservation) {
    check(reservation, Schema.makeReservation);

    var experienceId = reservation.experienceId;
    var experience = Experiences.findOne(experienceId);
    if (!experience) {
      throw new Meteor.Error(500, 'Invalid Experience');
    }

    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    var stay = Stays.findOne({users: user._id, active: true});
    var room, hotel, device;

    if (stay) {
      room = Rooms.findOne(stay.roomId);

      if (room) {
        device = Devices.findOne({roomId: room._id});
      }

      hotel = Hotels.findOne(stay.hotelId);
    }

    if (typeof user.emails !== 'undefined' &&
      typeof user.emails[0] !== 'undefined' &&
      typeof user.emails[0].address !== 'undefined') {
      reservation.emailAddress = user.emails[0].address;
    } else {
      throw new Meteor.Error(500, 'No email address');
    }

    if (typeof user.profile !== 'undefined' && typeof user.profile.firstName !== 'undefined' && typeof user.profile.lastName !== 'undefined') {
      reservation.partyName = user.profile.firstName + " " + user.profile.lastName;
    } else {
      throw new Meteor.Error(500, 'No party name');
    }

    //valid request
    var order = {
      type: 'reservation',
      reservation: reservation,
      requestedDate: new Date(),
      requestedZone: reservation.zone,
      handledBy: 'plusmore',
      open: true,
      status: 'requested',
      userId: user._id
    };

    if (stay) {
      order.stayId = stay._id;
    }

    if (room) {
      order.roomId = room._id;
    }

    if (device) {
      order.deviceId = device._id;
    }

    if (hotel) {
      order.hotelId = hotel._id;
    }

    var orderId = Orders.insert(order);

    this.unblock();

    if (Meteor.isClient) {
      App.track("Submit Reservation Request", {
        "Experience Title": experience.title,
        "Experience Id": experience._id,
        "Experience Category": experience.category,
        "Experience City": experience.city
      });
    }

    if (Meteor.isServer) {
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

    return orderId;
  }
});
