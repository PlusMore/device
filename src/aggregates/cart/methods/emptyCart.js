Meteor.methods({
  emptyCart: function(cartId) {
    return CartItems.remove({
      cartId: cartId
    });
  }
});
