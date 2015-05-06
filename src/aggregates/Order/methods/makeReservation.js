Schema.makeReservation = new SimpleSchema({
  partySize: {
    type: Number,
    min: 1
  },
  date: {
    type: Date
  },
  zone: {
    type: Number
  },
  experienceId: {
    type: String
  }
});

// Make reservation requirements
//
// User: Must be a logged in user of PlusMore
//
// Hotel: No hotel requirements to order, but if a user has a stay it is
// useful to track that data for reporting purposes
// - handled in event by Order event handlers
//
// Notifications: Should send a notification
// - handled in notification event handlers

Meteor.methods({
  makeReservation: function(reservation) {
    // ************ Validation *********************
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
    // ************* End Validation ***************

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

    var orderId = Orders.insert(order);

    this.unblock();

    HotelGuestApp.Events.emit('order:experience-reservation-requested', {
      orderId: orderId
    });

    return orderId;
  }
});
