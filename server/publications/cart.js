Meteor.publish('cart', function(cartId) {
  return CartItems.find({
    cartId: cartId
  });
});
