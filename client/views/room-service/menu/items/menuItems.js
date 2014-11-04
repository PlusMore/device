Template.menuItems.helpers({
  hasMenuItems: function() {
    return MenuItems.find({menuCategoryId: this._id}).count();
  },
  menuItemsForCategory: function () {
    return MenuItems.find({menuCategoryId: this._id}, {sort: {active: -1}});
  },
  enabledClass: function() {
    return this.active ? 'enabled' : 'disabled';
  },
  isActive: function () {
    return this.active ? '' : '(Disabled)';
  }
});