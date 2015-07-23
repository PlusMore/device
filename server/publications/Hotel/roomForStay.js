Meteor.publish('roomForStay', function(stayId) {
  return [
    Rooms.find({
      stayId: stayId
    })
  ];
});

Meteor.startup(function() {
  Rooms._ensureIndex({stayId: 1});
});
