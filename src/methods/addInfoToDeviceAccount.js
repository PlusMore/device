Meteor.methods({
  addInfoToDeviceAccount: function(requestData) {
    check(requestData, Schema.accountInfo);

    Meteor.users.update(this.userId, {
      $addToSet: {
        emails: {
          address: requestData.emailAddress,
          verified: false
        }
      },
      $set: {
        'profile.firstName': requestData.firstName,
        'profile.lastName': requestData.lastName
      }
    });

    return true;

  }
});
