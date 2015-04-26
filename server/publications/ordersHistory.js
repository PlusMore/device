Meteor.publish('ordersHistory', function() {
  return [
    Orders.find({
      userId: this.userId
    })
  ];
});
