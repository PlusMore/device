Meteor.publish('ordersRecent', function() {
  var now = new Date();
  return [
    Orders.find({
      userId: this.userId,
      $or: [{
        open: true
      }, {
        "service.date": {
          $gt: now
        }
      }, {
        "reservation.date": {
          $gt: now
        }
      }]
    })
  ];
});

Meteor.startup(function() {
  Orders._ensureIndex({userId: 1});
});
