Template.roomService.helpers({
  subscriptionsReady: function() {
    if (subscriptions && (subscriptions.stayInfo  && typeof subscriptions.stayInfo !== 'undefined') && (subscriptions.deviceData && typeof subscriptions.deviceData !== 'undefined')) {
      return subscriptions.stayInfo.ready() && subscriptions.deviceData.ready();
    }
  }
});

Meteor.startup(function() {
  Deps.autorun(function() {
    var selectedService = Session.get('selectedService');
    var hotelCursor = Hotels.find();
    var stayId = Session.get('stayId');
    
    if (selectedService === 'roomService' && hotelCursor.count() > 0) {
      console.log('subscribing to menu');
      var hotel = Hotels.findOne();

      subscriptions.menu = Meteor.subscribe('hotelMenu', hotel._id);
      subscriptions.cart = Meteor.subscribe('cart', stayId);
    } else {
      if (subscriptions.menu) {
        console.log('deleting menu subscription');
        subscriptions.menu.stop();
        delete subscriptions.menu;
      }
      if (subscriptions.cart) {
        console.log('deleting cart subscription');
        subscriptions.cart.stop();
        delete subscriptions.cart;
      }
    }
  });
});