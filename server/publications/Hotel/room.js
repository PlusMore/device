Meteor.publish('room', function(roomId) {
  if (roomId) {
    console.log('publishing room data for ' + roomId);
    var room = Rooms.findOne(roomId);
    if (room) {
      return [
        Rooms.find(roomId)
      ];
    } else {
      console.log('no room data found for ' + roomId);
    }
  }
});
