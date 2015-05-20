Template.roomServiceDetails.helpers({
  taxRate: function() {
    var hotel = Hotels.findOne();
    return Number(hotel.taxRate * 100).toFixed(2);
  }
});
