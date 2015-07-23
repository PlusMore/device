Template.roomService.events({
  'click #jump-to-order': function() {
    var $main = $('.main');
    var height = $main[0].scrollHeight;

    $main.animate({
      scrollTop: height + "px"
    });
  }
});

Template.roomService.onCreated(function() {
  var stay = Stays.findOne();
  var stayId = stay && stay._id;
  var hotels = Hotels.find();
  var hotel = Hotels.findOne();
  var user = Meteor.user();
  var onboarding = Session.get('onboarding');

  var cartId = Meteor.default_connection._lastSessionId;
  console.log('wait on room service');

  if (stayId && !onboarding) {
    console.log('cart is stayid');
    cartId = stayId;
  }

  if (hotel) {
    console.log('cart', cartId);
    this.subscribe('hotelMenu', hotel._id);
    this.subscribe('cart', cartId);
  }
});
