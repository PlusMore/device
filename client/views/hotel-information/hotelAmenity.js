Template.hotelAmenity.helpers({
	bulletpoints: function () {
		return amenityDetails.find({this._id});
	},
	hasBulletpoints: function () {
		return amenityDetails.find({this._id}) > 0;
	}
});