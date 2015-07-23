Meteor.publish('stay', function(stayId) {
  if (stayId) {
    console.log('publishing stay data for ' + stayId);
    var stay = Stays.findOne(stayId);
    if (stay) {
      return [
        Stays.find(stayId),
        Meteor.users.find({
          stayId: stayId
        })
      ];
    } else {
      console.log('no stay data found for ' + stayId);
    }
  }
});

Meteor.startup(function() {
  Meteor.users._ensureIndex({stayId: 1});
});
