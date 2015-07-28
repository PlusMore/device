Meteor.publish('cart', function(cartId) {
  return CartItems.find({
    cartId: cartId
  });
});

Meteor.startup(function() {
  CartItems._ensureIndex({cartId: 1});
});
