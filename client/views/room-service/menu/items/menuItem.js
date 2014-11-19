Template.menuItem.events({
  'click .menu-item': function () {
    console.log('click menu-item');
    Session.set('addItem', this._id);
  }
});