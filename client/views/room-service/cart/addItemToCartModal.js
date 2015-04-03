Template.addItemToCartModal.events({
  'click [data-dismiss="modal"]':function(e, tmpl){
    e.preventDefault();
    e.stopImmediatePropagation();

    modal.close();

    return false;
  },
  'click #add-item-to-cart':function(e,tmpl){
    e.preventDefault();
    e.stopImmediatePropagation();

    var qty = 1;
    var itemType = 'menuItem';
    var itemId = this._id;
    var stay = Stays.findOne();
    var stayId = stay && stay._id;
    var cartId = stayId || Meteor.default_connection._lastSessionId;
    var comments = tmpl.find('[name=comments]').value;
    var now = moment();
    var zone = now.zone();

    console.log('add item to cart: ', cartId, now);

    Meteor.call('addToCart', now.toDate(), zone, cartId, itemType, itemId, qty, comments, function(err, result) {
      if (err) {
        return Errors.throw(err.reason);
      }

      modal.close();
    });

    return false;
  }
});
