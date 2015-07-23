Meteor.publish('deviceByStayId', function(stayId) {
  var stay = Stays.findOne(stayId);

  if (stay) {
    var room = Rooms.findOne({
      stayId: stayId
    });

    if (room) {
      var device = Devices.findOne({
        roomId: room._id
      });

      if (device) {
        return [
          Devices.find({
            roomId: room._id
          }),
          Hotels.find(room.hotelId),
          Rooms.find({
            stayId: stayId
          }),
          HotelServices.find({
            hotelId: room.hotelId,
            active: true
          })
        ];
      }
    }
  }

});

Meteor.startup(function() {
  Devices._ensureIndex({roomId: 1});
});

Meteor.startup(function() {
  Rooms._ensureIndex({stayId: 1});
});

Meteor.startup(function() {
  HotelServices._ensureIndex({hotelId: 1});
});
