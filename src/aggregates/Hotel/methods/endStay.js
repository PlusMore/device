Meteor.methods({
  endStay: function(stayId) {
    console.log('force end stay');
    return Stays.update(stayId, {
      $set: {
        checkoutDate: new Date(),
        active: false
      }
    });
  }
});
