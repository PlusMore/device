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
