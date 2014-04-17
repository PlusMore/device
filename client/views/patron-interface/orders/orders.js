Template.orders.helpers({
  hasOrders: function() {
    return Orders.find().count() > 0;
  },
  orders: function() {
    return Orders.find();
  }
});