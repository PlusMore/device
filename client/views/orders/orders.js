Template.orders.helpers({
  hasOrders: function() {
    return Orders.find().count() > 0;
  },
  orders: function() {
  	var orderFilters = Session.get('orderFilters');
  	
  	typeFiltersList = [];
  	_.where(orderFilters, {group: 'Orders'}).forEach(function(filter){
  		typeFiltersList.push(filter.name);
  	});

  	statusFiltersList = []
  	_.where(orderFilters, {group: 'Status'}).forEach(function(filter){
  		statusFiltersList.push(filter.name);
  	});

    return Orders.find({},{sort: {requestedDate: -1}});
  }
});

Template.orders.events({
  'click .js-select-user': function () {
    Session.set('selectUser', true);
  }
});