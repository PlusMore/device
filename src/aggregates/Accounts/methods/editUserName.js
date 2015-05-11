Meteor.methods({
  editUserName: function(doc) {
    check(doc, Schema.accountInfo);

    Meteor.users.update(this.userId, {
      $set: {
        'profile.firstName': doc.firstName,
        'profile.lastName': doc.lastName
      }
    });

    return true;
  }
});
