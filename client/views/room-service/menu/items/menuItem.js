Template.menuItem.events({
  'click .menu-item': function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (Session.get('animatingMenu') || Menu.isOpen()) {
      return;
    }

    if ($(e.currentTarget).closest('.perspective').hasClass('modalview')) {
      return;
    }

    console.log('click menu-item');
    modal.show('addItemToCartModal', this);

    return false;
  }
});
