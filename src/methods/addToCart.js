Meteor.methods({
  addToCart: function(now, zone, cartId, itemType, itemId, qty, comments) {
    console.log('var now = ', now);
    console.log('var zone = ', zone);

    check(now, Date);
    check(zone, Number);
    check(cartId, String);
    check(itemType, String);
    check(itemId, String);
    check(qty, Number);
    if (comments) {
      check(comments, String);
    }

    var cartItem = {
      cartId: cartId,
      itemType: itemType,
      itemId: itemId,
      qty: qty,
      comments: comments || ''
    };

    checkCartItem(zone, now, cartItem);

    if (cartItem.qty > 0) {
      CartItems.insert(cartItem);
    } else {
      throw new Meteor.Error(420, 'Quantity is 0');
    }
  }
});
