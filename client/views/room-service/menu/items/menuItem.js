Template.menuItem.events({
  'click .menu-item': function (e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation();

    console.log('click menu-item');
    Session.set('addItem', this._id);
    Session.set('modalOpen', true);

    return false;
  }
});