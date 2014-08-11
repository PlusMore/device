Template.addItemToCartModal.helpers({
  item: function() {
    return MenuItems.findOne(Session.get('addItem'));
  }, 
  isVisibleClass: function() {
    if (!!Session.get('addItem')) {
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
    Session.set('addItem', undefined);
  },
  'click #add-item-to-cart':function(evt,tmpl){
    var qty = 1;
    var itemType = 'menuItem';
    var itemId = this._id;
    var cartId = Session.get('stayId'); 
    var comments = tmpl.find('[name=comments]').value;
    Meteor.call('addToCart', cartId, itemType, itemId, qty, comments);
    Session.set('addItem', undefined);
  }
});