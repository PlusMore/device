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
  }
}); 

Template.cart.events({
  'click .remove-item':function(e, tmpl) {
    var that = this;
    bootbox.dialog({
      title: 'Remove ' + that.name,
      message: "Are you sure you would like to remove " + that.name + ' from your cart?', 
      buttons: {
        cancel: {
          label: 'Cancel',
          className: 'btn-cancel'
        },
        main: {
          label: 'Remove ' + that.name,
          className: 'btn-default',
          callback:function(result) {
            Meteor.call('removeCartItem',that._id);
          }
        }
      }
    });
  }, 
  'click .btn-reset': function(e, tmpl) {
    bootbox.dialog({
      title: 'Empty Cart',
      message: "Are you sure you'd like to empty your cart?", 
      buttons: {
        cancel: {
          label: 'Cancel',
          className: 'btn-cancel'
        },
        main: {
          label: 'Empty Cart',
          className: 'btn-default',
          callback:function(result) {
            Meteor.call('emptyCart', Session.get('stayId'));
          }
        }
      }
    });
  }, 
  'click #place-order': function(e, tmpl) {
    bootbox.dialog({
      title: 'Place Order',
      message: "Are you sure you would like to place your order now?", 
      buttons: {
        cancel: {
          label: 'Cancel',
          className: 'btn-cancel'
        },
        main: {
          label: 'Place Order',
          className: 'btn-default',
          callback:function(result) {
            Meteor.call('orderRoomServiceCartItems', Session.get('stayId'), function(err, result) {
              if (err) { 
                return Errors.throw(err.reason);
              }
              Router.go('orders');
            });
          }
        }
      }
    });
  }
});