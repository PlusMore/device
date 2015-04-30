Meteor.publish('userStays', function() {
  return [
    Stays.find({
      users: this.userId,
      active: true
    })
  ];
});
