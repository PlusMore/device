Template.hotelInformation.helpers({
	hotel: function () {
		return Hotels.findOne();
	}
});