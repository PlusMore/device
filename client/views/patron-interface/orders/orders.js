Template.orders.helpers({
  hasOrders: function() {
    return Orders.find({'reservation.date': {$gt: new Date()}}).count() > 0;
  },
  upcomingOrders: function() {
    return Orders.find({'reservation.date': {$gt: new Date()}});
  }
});