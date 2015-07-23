Meteor.methods({
  orderRoomServiceCartItems: function(now, zone, cartId, tip) {
    check(now, Date);
    check(cartId, String);
    check(zone, Number);
    tip = tip || 0;
    check(tip, Number);

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

    var hotelService = HotelServices.find({hotelId: hotel._id, type: "roomService"});
    if (!hotelService) {
      throw new Meteor.Error(420, 'Not a valid hotel service');
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
    var taxRate = hotel.taxRate || 0.06;
    orderedItems.tax = orderedItems.subtotal * taxRate;
    orderedItems.total = orderedItems.subtotal + orderedItems.tax + tip;

    var service = {
      type: 'roomService',
      serviceId: hotelService._id,
      orderedItems: orderedItems,
      orderSubtotal: orderedItems.subtotal,
      orderTax: orderedItems.tax,
      orderTotal: orderedItems.total,
      zone: zone,
      tip: tip,
      taxRate: taxRate
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
