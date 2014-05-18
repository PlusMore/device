Template.orders.helpers({
  hasOrders: function() {
    return Orders.find({'reservation.dateDatetime': {$gt: new Date()}}).count() > 0;
  },
  upcomingOrders: function() {
    return Orders.find({'reservation.dateDatetime': {$gt: new Date()}});
  }
});