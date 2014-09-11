Template.about.helpers({
  hotelCity: function () {
    var hotel = Hotels.findOne();
    return hotel.geo.city;
  }
});

Template.about.events({
  'click .btn-skip': function (e) {
    e.preventDefault();
    App.endTutorial();
  }
});