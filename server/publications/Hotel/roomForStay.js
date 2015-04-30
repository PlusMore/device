Meteor.publish('roomForStay', function(stayId) {
  return [
    Rooms.find({
      stayId: stayId
    })
  ];
});
