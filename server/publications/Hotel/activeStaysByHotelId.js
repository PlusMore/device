Meteor.publish('activeStaysByHotelId', function(hotelId) {
  var now = new Date();

  return Stays.find({
    hotelId: hotelId,
    checkInDate: {
      $lte: now
    },
    checkoutDate: {
      $gte: now
    },
    zone: {
      $exists: true
    }
  });
});

Meteor.startup(function() {
  Stays._ensureIndex({hotelId: 1, checkInDate: -1, checkoutDate: 1});
});
