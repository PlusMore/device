Meteor.methods({
  endStay: function(stayId) {
    check(stayId, String);

    var checkoutDate = new Date();

    Stays.update({
      _id: stayId
    }, {
      $set: {
        active: false,
        checkoutDate: checkoutDate
      }
    });
  }
});
