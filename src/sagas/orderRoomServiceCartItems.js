Meteor.methods({
  orderRoomServiceCartItems: function(now, zone, cartId) {
    check(now, Date);
    check(cartId, String);
    check(zone, Number);

    console.log('placing order for cart', cartId);

    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    var stay = Stays.findOne(user.stayId);

    if (!stay) {
      throw new Meteor.Error(403, 'No current stay registered for user');
    }

    if (moment().zone(stay.zone) > moment(stay.checkoutDate).zone(stay.zone)) {
      throw new Meteor.Error(500, 'Stay has ended.');
    }

    var room = Rooms.findOne(stay.roomId);
    if (!room) {
      throw new Meteor.Error(420, 'Not a proper room');
    }

    var device = Devices.findOne({roomId: room._id});

    var hotel = Hotels.findOne(stay.hotelId);
    if (!hotel) {
      throw new Meteor.Error(420, 'Not a valid hotel');
    }

    var cartItems = CartItems.find({
      cartId: cartId
    });

    if (cartItems.count() < 1) {
      throw new Meteor.Error(420, 'Cart is Empty');
    }

    cartItems.forEach(function(cartItem) {
      checkCartItem(zone, now, cartItem);
    });
    // Validated

    // Calculate Totals
    var total = 0;
    var orderedItems = [];

    cartItems.forEach(function(cartItem) {
      var item;
      if (cartItem.itemType === 'menuItem') {
        item = MenuItems.findOne(cartItem.itemId);
        MenuItems.update(item._id, {
          $inc: {
            orderCount: 1
          }
        });
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

    var service = {
      type: 'roomService',
      orderedItems: orderedItems,
      orderSubtotal: orderedItems.subtotal,
      orderTax: orderedItems.tax,
      orderTotal: orderedItems.total,
      zone: zone
    };

    var order = {
      type: 'service',
      handledBy: 'hotel', // Make configurable 'smart routing'
      service: service,
      roomId: room._id,
      hotelId: hotel._id,
      stayId: stay._id,
      requestedDate: new Date(),
      requestedZone: zone,
      open: true,
      status: 'requested',
      userId: user._id
    }

    if (device) {
      order.deviceId = device._id;
    }

    return Orders.insert(order, function(err) {
      if (err) throw new Meteor.Error(err);
    });
  }
});
