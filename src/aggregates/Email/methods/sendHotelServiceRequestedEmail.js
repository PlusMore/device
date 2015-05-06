Meteor.methods({
  sendHotelServiceRequestedEmail: function(order) {
    this.unblock(); // client doesn't need to wait for this

    if (Meteor.isServer) {
      var orderId = order._id;
      var serviceRequest = order.service;
      var room = Rooms.findOne(order.roomId);
      var hotel = Hotels.findOne(room.hotelId);
      var user = Meteor.users.findOne(order.userId);

      var url = stripTrailingSlash(Meteor.settings.apps.admin.url) + "/patron-order/{0}".format(orderId);
      var when = moment(serviceRequest.date).zone(serviceRequest.zone);
      when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";

      var friendlyServiceType = HotelServices.friendlyServiceType(serviceRequest.type);

      // for our information
      Email.send({
        to: 'order-service@plusmoretablets.com',
        from: "noreply@plusmoretablets.com",
        subject: "Info: Device in {0} at {1} has requested hotel service.\n\n".format(room.name, hotel.name),
        text: "This is an informational email and does not require your service\n\n" +
          "Device in {0} at {1} has requested hotel service.\n\n".format(room.name, hotel.name) +
          "Request Details:\n\n" +
          "Guest Name: {0}\n".format(user.displayName()) +
          "Request Service: {0}\n".format(friendlyServiceType) +
          "When: {0}\n".format(when) +
          "\nTo view the status of this request, click the link below\n\n" +
          url
      });
    }
  }
});
