Meteor.methods({
  removeCartItem: function(id) {
    check(id, String);
    CartItems.remove({
      _id: id
    });
  }
});
