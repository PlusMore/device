Template.menuItem.events({
  'click .menu-item': function () {
    Session.set('addItem', this._id);
  }
});