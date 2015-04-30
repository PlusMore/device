CartItems = new Meteor.Collection('cartItems');

CartItems.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  }
});

checkCartItem = function(zone, now, cartItem) {
  if (cartItem.itemType === 'menuItem') {
    var menuItem = MenuItems.findOne(cartItem.itemId);
    if (!menuItem) {
      throw new Meteor.Error(420, 'Menu Item Not Found', {
        _id: cartItem.itemId
      });
    }

    var menuCategory = MenuCategories.findOne(menuItem.menuCategoryId);

    if (!menuCategory) {
      throw new Meteor.Error(420, 'Menu Category Not Found', {
        _id: menuItem.menuCategoryId
      });
    }

    if (!isBetweenTimes(zone, now, menuCategory.startMinutes, menuCategory.endMinutes)) {
      throw new Meteor.Error(420, '{0} is only available between {1} and {2}'.format(menuItem.name, menuCategory.startTime, menuCategory.endTime));
    }
  } else {
    throw new Meteor.Error(420, 'Only Menu Items can be ordered at this time.');
  }
};
