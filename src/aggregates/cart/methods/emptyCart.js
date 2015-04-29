Meteor.methods({
  emptyCart: function(cartId) {
    CartItems.remove({
      cartId: cartId
    });
  }
});
