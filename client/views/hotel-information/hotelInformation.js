Template.hotelInformation.helpers({
  hotel: function () {
    return Hotels.findOne();
  },
  amenities: function () {
    return HotelAmenities.find();
  }
});