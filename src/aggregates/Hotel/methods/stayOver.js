Meteor.methods({
  stayOver: function(stayId) {
    var stay = Stays.findOne(stayId);

    // if stay is over, end it.
    if (moment().zone(stay.zone) > moment(stay.checkoutDate).zone(stay.zone)) {
      console.log('stay expired', stay._id);
      Stays.update(stayId, {
        $set: {
          active: false
        }
      });
      Rooms.update(stay.roomId, {
        $unset: {
          stayId: 1
        }
      });
      if (stay.users && stay.users.length > 0) {
        Meteor.users.update({
          _id: {
            $in: stay.users
          }
        }, {
          $unset: {
            stayId: 1
          }
        });
      }
    }
  }
});
