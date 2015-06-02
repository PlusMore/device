Template.cart.helpers({
  hasCartItems: function() {
    var stay = Stays.findOne();
    var stayId = stay && stay._id;
    var cartId = stayId || Meteor.default_connection._lastSessionId;
    return CartItems.find({cartId: cartId}).count() > 0;
  },
  emptyCartDisabled: function() {
    var stay = Stays.findOne();
    var stayId = stay && stay._id;
    var cartId = stayId || Meteor.default_connection._lastSessionId;
    return CartItems.find({cartId: cartId}).count() > 0 ? '' : 'disabled';
  },
  cartItems: function(){
    var shopCart = [];
    var stay = Stays.findOne();
    var stayId = stay && stay._id;
    var cartId = stayId || Meteor.default_connection._lastSessionId;
    var cartItems = CartItems.find({cartId: cartId});
    var total = 0;
    var tip = Session.get('selectedTip') || 0;
    var hotel = Hotels.findOne();

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
    var taxRate = hotel && hotel.taxRate || 0.06;
    shopCart.tax = shopCart.subtotal * taxRate;
    shopCart.total = shopCart.subtotal + shopCart.tax + tip;
    return shopCart;
  },
  taxRate: function() {
    var hotel = Hotels.findOne();
    return Number(hotel.taxRate * 100).toFixed(2);
  }
});

Template.cart.events({
  'click .remove-item':function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var that = this;
    Session.set('modalOpen', true);

    bootbox.dialog({
      title: 'Remove ' + that.name,
      message: "Are you sure you would like to remove " + that.name + ' from your cart?',
      closeButton: false,
      buttons: {
        cancel: {
          label: 'Cancel',
          className: 'btn-cancel',
          callback: function () {
            Session.set('modalOpen', false);
          }
        },
        main: {
          label: 'Remove Item',
          className: 'btn-default',
          callback:function(result) {
            Meteor.call('removeCartItem',that._id);
            Session.set('modalOpen', false);
          }
        }
      }
    });
    return false;
  },
  'click .btn-reset': function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Session.set('modalOpen', true);
    bootbox.dialog({
      title: 'Empty Cart',
      message: "Are you sure you'd like to empty your cart?",
      closeButton: false,
      buttons: {
        cancel: {
          label: 'Cancel',
          className: 'btn-cancel',
          callback: function () {
            Session.set('modalOpen', false);
          }
        },
        main: {
          label: 'Empty Cart',
          className: 'btn-default',
          callback:function(result) {
            var stay = Stays.findOne();
            var stayId = stay && stay._id;
            var cartId = stayId || Meteor.default_connection._lastSessionId;
            Meteor.call('emptyCart', cartId, function(err, res) {
              Session.set('modalOpen', false);
            });
          }
        }
      }
    });
    return false;
  },
  'click #place-order': function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var stay = Stays.findOne();
    var stayId = stay && stay._id;
    var cartId = stayId || Meteor.default_connection._lastSessionId;

    console.log('place order for cart', cartId)
    Session.set('modalOpen', true);
    bootbox.dialog({
      title: 'Place Order',
      message: "Are you sure you would like to place your order now?",
      closeButton: false,
      buttons: {
        cancel: {
          label: 'Cancel',
          className: 'btn-cancel',
          callback: function () {
            Session.set('modalOpen', false);
          }
        },
        main: {
          label: 'Place Order',
          className: 'btn-default',
          callback:function(result) {
            var now = moment();
            var zone = now.zone();
            var tip = Session.get('selectedTip');

            $(document).one('user-selected', function() {
              $(document).off('user-selected');
              $(document).off('cancel-user-selected');
              Session.set('modalOpen', false);


              Meteor.call('orderRoomServiceCartItems', now.toDate(), zone, cartId, tip, function(err, result) {
                if (err) {
                  return Errors.throw(err.message);
                }
                Router.go('recent-orders');
              });
            });

            $(document).one('cancel-user-selected', function() {
              $(document).off('user-selected');
              $(document).off('cancel-user-selected');
              Session.set('modalOpen', false);


              return Errors.throw('Please log in to order room service.');
            });

            if (!Meteor.user()) {
              modal.show('selectUser');
            } else {
              console.log('has user - trigger user-selected');
              $(document).trigger('user-selected');
            }
          }
        }
      }
    });

    return false;
  }
});



// bootbox-close-button click hideModal
