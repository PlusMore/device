Meteor.publish('hotel', function(hotelId) {
  if (hotelId) {
    console.log('publishing hotel data for ' + hotelId);
    var hotel = Hotels.findOne(hotelId);
    if (hotel) {
      return [
        Hotels.find(hotelId),
        HotelServices.find({
          hotelId: hotelId,
          active: true
        })
      ];
    } else {
      console.log('no hotel data found for ' + hotelId);
    }
  }
});

Meteor.startup(function() {
  HotelServices._ensureIndex({hotelId: 1});
});
