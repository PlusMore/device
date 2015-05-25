Meteor.publish('hotelAmenities', function(hotelId) {
  return HotelAmenities.find({
    hotelId: hotelId
  });
});

Meteor.startup(function() {
  HotelAmenities._ensureIndex({hotelId: 1});
});
