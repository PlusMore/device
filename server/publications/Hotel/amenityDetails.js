Meteor.publish('amenityDetails', function(hotelId) {
  return AmenityDetails.find({
    hotelId: hotelId
  });
});
