Template.orders.helpers({
  hasOrders: function() {
    var ordersView = Session.get('ordersView') || 'recent';
    if (ordersView == 'recent') {
      return Orders.find({open: true}).count() > 0;
    } else {
      return Orders.find({open: false}).count() > 0;
    }
  },
  orders: function() {
  	var ordersView = Session.get('ordersView') || 'recent';
    if (ordersView == 'recent') {
      return Orders.find({open: true}, {sort: {requestedDate: -1}});
    } else {
      return Orders.find({open: false}, {sort: {requestedDate: -1}});
    }
  }
});

Template.orders.events({
  'click .js-select-user': function () {
    Session.set('selectUser', true);
  }
});