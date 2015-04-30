Meteor.publish('hotelAmenities', function(hotelId) {
  return HotelAmenities.find({
    hotelId: hotelId
  });
});
