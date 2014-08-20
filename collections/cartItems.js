CartItems = new Meteor.Collection('cartItems');

CartItems.allow({
  insert: function(userId, doc){
    return true;
  },
  update:  function(userId, doc, fieldNames, modifier){
    return true;
  },
  remove:  function(userId, doc){
    return true;
  }
});

var checkCartItem = function(cartItem) {
  if (cartItem.itemType === 'menuItem') {
    var menuItem = MenuItems.findOne(cartItem.itemId);
    if (!menuItem) {
      throw new Meteor.Error(420, 'Menu Item Not Found', {_id: cartItem.itemId});
    }

    var menuCategory = MenuCategories.findOne(menuItem.menuCategoryId);

    if (!menuCategory) {
      throw new Meteor.Error(420, 'Menu Category Not Found', {_id: menuItem.menuCategoryId});
    }

    if (!isNowBetweenTimes(menuCategory.startMinutes, menuCategory.endMinutes)) {
      throw new Meteor.Error(420, '{0} is only available between {1} and {2}'.format(menuItem.name, menuCategory.startTime, menuCategory.endTime));
    }
  } else {
    throw new Meteor.Error(420, 'Only Menu Items can be ordered at this time.');
  }
};

Meteor.methods({
  addToCart: function(cartId, itemType, itemId, qty, comments) {
    check(cartId, String);
    check(itemType, String);
    check(itemId, String);
    check(qty, Number);
    if (comments) {
      check(comments, String);
    }

    var cartItem  = {
      cartId: cartId,
      itemType: itemType,
      itemId: itemId,
      qty:qty,
      comments: comments || ''
    };

    checkCartItem(cartItem);
    
    if(cartItem.qty > 0){
      CartItems.insert(cartItem);
    } else{
      throw new Meteor.Error(420, 'Quantity is 0');
    }
  },
  removeCartItem: function(id) {
    check(id, String);
    CartItems.remove({_id:id});
  },
  emptyCart: function(cartId) {
    CartItems.remove({cartId: cartId});
  },
  orderRoomServiceCartItems: function(cartId) {
    check(cartId, String);
    
    // check user, device, and hotel
    var user = Meteor.user();
    var deviceId = user.deviceId;
    var device = Devices.findOne(deviceId);
    if (!device) {
      throw new Meteor.Error(420, 'Not a proper device');
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(420, 'Not a valid hotel');
    }

    var stay = Stays.findOne({userId: user._id});
    if (!stay) {
      throw new Meteor.Error(420, 'Not a valid stay');
    }

    var cartItems = CartItems.find({cartId: cartId});

    if (cartItems.count() < 1) {
      throw new Meteor.Error(420, 'Cart is Empty');
    }

    cartItems.forEach(checkCartItem);
    // Validated

    // Calculate Totals
    var total = 0;
    var orderedItems = [];

    cartItems.forEach(function(cartItem){
      var item;
      if (cartItem.itemType === 'menuItem') {
        item = MenuItems.findOne(cartItem.itemId);
        MenuItems.update(item._id, {$inc: {orderCount: 1}});
        cartItem.name = item.name;
        cartItem.price = (Number(item.price) * cartItem.qty);
      }
      total += cartItem.price;
      orderedItems.push(cartItem);
      CartItems.remove(cartItem._id);
    });

    orderedItems.subtotal = total;
    orderedItems.tax = orderedItems.subtotal * 0.06; // lookup tax for state? Based on hotelId? 
    orderedItems.total = orderedItems.subtotal + orderedItems.tax;

    return Orders.insert({
      type: 'request',
      for: 'hotel', // Make configurable 'smart routing'
      request: {
        type: 'roomService',
        orderedItems: orderedItems,
        orderSubtotal: orderedItems.subtotal,
        orderTax: orderedItems.tax,
        orderTotal: orderedItems.total
      },
      deviceId: device._id,
      deviceLocation: device.location,
      hotelId: hotel._id,
      stayId: stay._id,
      requestedAt: new Date(),
      open: true,
      read: false,
      status: 'pending',
      userId: user._id
    }, {validate: false}, function(err) {
      if (err) throw new Meteor.Error(err);
    });
  }
});