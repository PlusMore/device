Template.enterCheckoutDate.rendered = function () {
  $('.datepicker').pickadate({
    today: false,
    clear: false,
    min: moment({hour: 12, minute: 0}).add('days', 1).toDate(),
    onSet: function(date) {
      if (date.select) {
        var selectedDate = moment(date.select).hour(12).minute(0).second(0).toDate();
        console.log(selectedDate);
        Meteor.call('registerStay', selectedDate, function (error, stay) {
          if (error) throw new Meteor.Error(error);

          App.track('Enter Checkout Date', {
            "checkInDate": moment(stay.checkInDate).format('MMMM Do YYYY'),
            "checkoutDate": moment(stay.checkoutDate).format('MMMM Do YYYY')
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