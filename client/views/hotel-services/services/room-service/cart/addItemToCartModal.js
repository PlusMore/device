Template.addItemToCartModal.helpers({
  item: function() {
    return MenuItems.findOne(Session.get('addItem'));
  }, 
  isVisibleClass: function() {
    if (!!Session.get('addItem')) {
      if (Session.get('fadeOutAddItem')) {
        return 'show in animated fadeOutUp';
      }
      return 'show in animated fadeInDown';
    } else {
      return 'hidden';
    }
  }, 
  menuCategoryId: function() {
    return this._id;
  }
});

Template.addItemToCartModal.events({
  'click [data-dismiss="modal"]':function(){
    Session.set('fadeOutAddItem', true);
    Meteor.setTimeout(function() {
      Session.set('addItem', undefined);
      Session.set('fadeOutAddItem', false);
    }, 500);
  },
  'click #add-item-to-cart':function(evt,tmpl){
    var qty = 1;
    var itemType = 'menuItem';
    var itemId = this._id;
    var cartId = Session.get('stayId'); 
    var comments = tmpl.find('[name=comments]').value;
    var now = moment();
    var zone = now.zone();

    console.log('add item to cart: ', now);

    Meteor.call('addToCart', now.toDate(), zone, cartId, itemType, itemId, qty, comments, function(err, result) {
      if (err) {
        return Errors.throw(err.reason);
      }
      Session.set('fadeOutAddItem', true);
      Meteor.setTimeout(function() {
        Session.set('addItem', undefined);
        Session.set('fadeOutAddItem', false);
      }, 500);
    });
    
  }
});