Template.ordersHistory.helpers({
  hasOrders: function() {
    return Orders.find({}).count() > 0;
  },
  orders: function() {
  	return Orders.find({});
  }
});

Template.ordersHistory.events({
  'click .js-select-user': function () {
    Session.set('selectUser', true);
  }
});