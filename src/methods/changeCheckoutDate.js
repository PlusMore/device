Meteor.methods({
  changeCheckoutDate: function(stayId, checkoutDate) {
    check(stayId, String);
    check(checkoutDate, Date);
    Stays.update(stayId, {
      $set: {
        checkoutDate: checkoutDate
      }
    });
  }
});
