Template.enterCheckoutDate.rendered = function () {
  $('.datepicker').pickadate({
    today: false,
    clear: false,
    min: moment({hour: 12, minute: 0}).add('days', 1).toDate(),
    onSet: function(date) {
      if (date.select) {
        var selectedDate = moment(date.select).hour(12).minute(0).second(0).toDate();
        console.log(selectedDate);
        Meteor.call('registerStay', selectedDate, function (error, stayId) {
          if (error) throw new Meteor.Error(error);
          
          var stay = Stays.findOne(stayId);
          App.track('Enter Checkout Date', {
            "checkInDate": stay.checkInDate,
            "checkoutDate": stay.checkoutDate
          });
          Router.go('experiences', {category: 'Dining'});
        });
      }
    }
  }).click();

};

Template.enterCheckoutDate.events({
  'click .picker__holder': function (e) {
    e.preventDefault();
    return false;  
  }
});