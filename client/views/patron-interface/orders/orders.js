Template.ordersSection.helpers({
  hasOrders: function() {
    return Orders.find().count() > 0;
  },
  upcomingOrders: function() {
    return Orders.find({'reservation.dateDatetime': {$gt: new Date()}});
  }
});