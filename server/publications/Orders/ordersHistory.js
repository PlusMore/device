Meteor.publish('ordersHistory', function() {
  return [
    Orders.find({
      userId: this.userId
    })
  ];
});

Meteor.startup(function() {
  Orders._ensureIndex({userId: 1});
});
