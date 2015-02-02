Template.ordersSubnav.helpers({
  recentLinkClass: function () {
    if(!Session.get('ordersView') || Session.get('ordersView') == 'recent'){
      return "active";
    } else {
      return '';
    }
  },
  historyLinkClass: function () {
    if(Session.get('ordersView') == 'history'){
      return "active";
    } else {
      return '';
    }
  }
});

Template.ordersSubnav.events({
  'click #recent': function(e) {
    e.preventDefault();
    Session.set('ordersView', 'recent');
  },
  'click #history': function(e) {
    e.preventDefault();
    Session.set('ordersView', 'history');
  },
});
