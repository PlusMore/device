Meteor.publish('orders', function() {
  return [
    Orders.find({
      userId: this.userId
    })
  ];
});
