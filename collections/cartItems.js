CartItems = new Meteor.Collection('cartItems');

CartItems.allow({
  insert: function(userId, doc){
    return true;
  },
  update:  function(userId, doc, fieldNames, modifier){
    return true;
  },
  remove:  function(userId, doc){
    return true;
  }
});

Meteor.methods({
  addToCart: function(cartId, itemType, itemId, qty, comments) {
    check(cartId, String);
    check(itemType, String);
    check(itemId, String);
    check(qty, Number);
    if (comments) {
      check(comments, String);
    }
    
    if(qty > 0){
      CartItems.insert({
        cartId: cartId,
        itemType: itemType,
        itemId: itemId,
        qty:qty,
        comments: comments || ''
      });
    } else{
      throw Meteor.Error(500, 'Quantity is 0');
    }
  },
  removeCartItem:function(id){
    check(id, String);
    CartItems.remove({_id:id});
  }
});