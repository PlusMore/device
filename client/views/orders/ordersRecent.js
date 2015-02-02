Template.ordersRecent.helpers({
  hasOrders: function() {
    return Orders.find({}).count() > 0;
  },
  orders: function() {
  	return Orders.find({});
  }
});

Template.ordersRecent.events({
  'click .js-select-user': function () {
    Session.set('selectUser', true);
  }
});