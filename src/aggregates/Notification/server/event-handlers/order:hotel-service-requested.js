// when a hotel service request is made, send out a notification
Meteor.startup(function() {
  var emailer = Cluster.discoverConnection('emailService');

  HotelGuestApp.Events.on('order:hotel-service-requested', function(eventData) {
    var order = Orders.findOne(eventData.orderId);

    // TODO: if notification preference is set, direct to the appropriate channel
    if (order) {

      var orderId = order._id;
      var serviceRequest = order.service;
      var room = Rooms.findOne(order.roomId);
      var hotel = Hotels.findOne(room.hotelId);
      var user = Meteor.users.findOne(order.userId);

      var adminEndpoint = Cluster.discovery.pickEndpoint('admin');
      var url;

      if (adminEndpoint) {
        url = stripTrailingSlash(adminEndpoint) + "/patron-order/{0}".format(orderId);
      } else {
        url = 'ERROR: Admin endpoint could not be reached. The url could not be generated. Please login to the admin application and search for the order.';
      }

      var when = moment(serviceRequest.date).zone(serviceRequest.zone);
      when = when.format('MMMM Do YYYY, h:mm a') + " (" + when.calendar() + ")";

      var friendlyServiceType = HotelServices.friendlyServiceType(serviceRequest.type);

      var options = {
        location: room.name,
        shortDescription: friendlyServiceType,
        guestName: user.displayName(),
        when: when,
        hotelName: hotel.name,
      };

      return emailer.call('sendHotelServiceRequestedEmail', options);
    }
  });
});
