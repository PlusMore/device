Template.selectUserFromStay.helpers({
  users: function() {
    var stays = Stays.find();
    var stay = Stays.findOne();
    if (stay) {
      return Meteor.users.find({stayId: stay._id});
    }

    return false;
  }
});
