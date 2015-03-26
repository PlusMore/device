Template.hotelAmenity.helpers({
  amenityDetails: function() {
    return AmenityDetails.find({
      amenityId: this._id
    });
  }
});
