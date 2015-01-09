Template.hotelInformation.helpers({
	hotel: function () {
		return Hotels.findOne();
	},
	inRoom: function () {
		return LocalStore.get('inRoom');
	},
	amenities: function () {
		return HotelAmenities.find();
	}
});