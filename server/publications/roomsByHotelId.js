Meteor.publish('roomsByHotelId', function(hotelId) {
  return Rooms.find({
    hotelId: hotelId
  });
});
