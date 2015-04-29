Meteor.methods({
  cancelService: function(orderId) {
    var order = Orders.findOne(orderId);
    if (!order) {
      throw new Meteor.Error(403, 'Not a valid order');
    }

    Orders.update(orderId, {
      $set: {
        open: false,
        status: 'cancelled',
        cancelledDate: new Date()
      }
    });
  }
});
