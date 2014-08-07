Meteor.startup(function() {
  Deps.autorun(function() {
    var selectedService = Session.get('selectedService');
    var hotelCursor = Hotels.find();
    
    if (selectedService === 'roomService' && hotelCursor.count() > 0) {
      console.log('subscribing to menu');
      var hotel = Hotels.findOne();
      subscriptions.menu = Meteor.subscribe('hotelMenu', hotel._id);
    } else {
      if (subscriptions.menu) {
        console.log('deleting menu subscription');
        subscriptions.menu.stop();
        delete subscriptions.menu;
      }
    }
  });
});