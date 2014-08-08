Template.menuItem.events({
  'click .menu-item': function () {
    console.log('clicked');
    Session.set('addItem', this._id);
  }
});