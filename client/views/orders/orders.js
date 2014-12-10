Template.orders.helpers({
  hasOrders: function() {
    return Orders.find().count() > 0;
  },
  orders: function() {
    return Orders.find({}, {sort: {requestedAt: -1}});
  }
});

Template.orders.events({
  'click .js-select-user': function () {
    Session.set('selectUser', true);
  }
});