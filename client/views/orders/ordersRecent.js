Template.ordersRecent.helpers({
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

Template.ordersRecent.events({
  'click .js-select-user': function() {
    modal.show('selectUser');
  }
});

Template.ordersRecent.onCreated(function(){
  this.subscribe('ordersRecent');
});
