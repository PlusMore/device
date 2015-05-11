Meteor.methods({
  denormalizeHotelDataForExperienceReservationRequest: function(order) {
    var hotelData = {};

    var userStay = Stays.currentStayForUserId(order.userId);
    var stayRoom, roomHotel;

    if (userStay) {
      hotelData.stayId = userStay._id;
      stayRoom = Rooms.findOne(userStay.roomId);

      if (stayRoom) {
        hotelData.roomId = stayRoom._id;
        roomHotel = Hotels.findOne(stayRoom.hotelId);

        if (roomHotel) {
          hotelData.hotelId = roomHotel._id;
        }
      }
    }

    if (!_.isEmpty(hotelData)) {
      console.log('User who requested reservation has current stay, appending hotel info to order.', hotelData);
      Orders.update(order._id, {$set: hotelData});
    } else {
      console.log('User without stay has requested a reservation');
    }
  }
});
