Meteor.publish('amenityDetails', function(hotelId) {
  return AmenityDetails.find({
    hotelId: hotelId
  });
});

Meteor.startup(function() {
  AmenityDetails._ensureIndex({hotelId: 1});
});
