Template.enterCheckoutDate.rendered = function () {
  $('.datepicker').pickadate({
    min: new Date(),
    onSet: function(date) {
      console.log(new Date(date.select));
    }
  }).click();

};