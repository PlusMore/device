Template.cart.helpers({
  hasCartItems: function() {
    var stayId = Session.get('stayId');
    return CartItems.find({cartId: stayId}).count() > 0;
  },
  cartItems: function(){
    var shopCart = [];
    var stayId = Session.get('stayId');
    var cartItems = CartItems.find({cartId: stayId});
    var total = 0;

    cartItems.forEach(function(cartItem){
      var item;
      if (cartItem.itemType === 'menuItem') {
        item = MenuItems.findOne(cartItem.itemId);
        cartItem.name = item.name;
        cartItem.price = (Number(item.price) * cartItem.qty);
      }
      total += cartItem.price;
      shopCart.push(cartItem);
    });

    shopCart.subtotal = total;
    shopCart.tax = shopCart.subtotal * 0.06; // lookup tax for state? Based on hotelId? 
    shopCart.total = shopCart.subtotal + shopCart.tax;
    return shopCart;
  },
  currency: function(num){
    num = num || 0;
    return '$' + Number(num).toFixed(2);
  }
}); 

Template.cart.events({
  'click .remove-item':function(evt,tmpl){
    Meteor.call('removeCartItem',this._id);
  }
});