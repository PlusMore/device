Meteor.methods({
  getProfile: function(email) {
    var user = Meteor.users.findOne({
      'emails.address': email
    });
    if (user) {
      return user.profile;
    } else {
      return false;
    }
  }
});
