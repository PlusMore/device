Template.ordersHistory.helpers({
  hasOrders: function() {
    return Orders.find({}).count() > 0;
  },
  orders: function() {
    return Orders.find({}, {
      sort: {
        requestedDate: -1
      }
    });
  }
});

Template.ordersHistory.events({
  'click .js-select-user': function() {
    modal.show('selectUser');
  }
});

Template.ordersHistory.onCreated(function() {
  this.subscribe('ordersHistory');
});
