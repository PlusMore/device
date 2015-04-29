Meteor.methods({
  doesUserExist: function(email) {
    var user = Meteor.users.findOne({
      'emails.address': email
    });
    if (user) {
      return user._id;
    } else {
      return false;
    }
  }
});
