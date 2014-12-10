Template.cart.helpers({
  hasCartItems: function() {
    var cartId = Session.get('stayId') || Meteor.default_connection._lastSessionId;
    return CartItems.find({cartId: cartId}).count() > 0;
  },
  cartItems: function(){
    var shopCart = [];
    var cartId = Session.get('stayId') || Meteor.default_connection._lastSessionId;
    var cartItems = CartItems.find({cartId: cartId});
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
          label: 'Remove Item',
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
            var cartId = Session.get('stayId') || Meteor.default_connection._lastSessionId;
            Meteor.call('emptyCart', cartId);
          }
        }
      }
    });
  }, 
  'click #place-order': function(e, tmpl) {
    var cartId = Session.get('stayId') || Meteor.default_connection._lastSessionId;

    console.log('place order for cart', cartId)
  
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
            var now = moment();
            var zone = now.zone();

            $(document).one('user-selected', function() {
              $(document).off('user-selected');
              $(document).off('cancel-user-selected');
              
              Meteor.call('orderRoomServiceCartItems', now.toDate(), zone, cartId, function(err, result) {
                if (err) { 
                  return Errors.throw(err.message);
                }
                Router.go('orders');
              });
            });

            $(document).one('cancel-user-selected', function() {
              $(document).off('user-selected');
              $(document).off('cancel-user-selected');

              return Errors.throw('Please log in to order room service.');
            });

            if (!Meteor.user()) {
              Session.set('selectUser', true);
            } else {
              console.log('has user - trigger user-selected');
              $(document).trigger('user-selected');
            }
          }
        }
      }
    });
  }
});