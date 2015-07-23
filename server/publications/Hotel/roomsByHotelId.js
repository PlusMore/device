Meteor.publish('roomsByHotelId', function(hotelId) {
  return Rooms.find({
    hotelId: hotelId
  });
});

Meteor.startup(function() {
  Rooms._ensureIndex({hotelId: 1});
});
