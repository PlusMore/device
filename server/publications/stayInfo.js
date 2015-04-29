Meteor.publish('stayInfo', function(stayId) {
  var fields = {
    stayId: 1
  };

  return [
    Stays.find(stayId),
    Meteor.users.find({
      stayId: stayId
    })
  ];
});
