Meteor.methods({
  cancelReservation: function(orderId) {
    var order = Orders.findOne(orderId);
    if (!order) {
      throw new Meteor.Error(403, 'Not a valid order');
    }

    Orders.update(orderId, {
      $set: {
        open: false,
        status: 'cancelled',
        cancelledDate: new Date()
      }
    });

    this.unblock();
    HotelGuestApp.Events.emit('order:experience-reservation-cancelled', {
      orderId: orderId
    });
  }
});
