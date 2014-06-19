Schema.accountInfo = new SimpleSchema({
  firstName: {
    type: String,
    label: 'First'
  },
  lastName: {
    type: String,
    label: 'Last'
  },
  emailAddress: {
    type: String,
    label: "Email Address"
  }
});

Meteor.methods({
  addInfoToDeviceAccount: function(requestData) {
    check(requestData, Schema.accountInfo);

    var fullName = "{0} {1}".format(requestData.firstName, requestData.lastName);
    
    Meteor.users.update(this.userId, {
      $addToSet: {
        emails: {
          address: requestData.emailAddress,
          verified: false
        }
      },
      $set: {
        'profile.name': fullName,
        'profile.firstName': requestData.firstName,
        'profile.lastName': requestData.lastName
      }
    });

    return true;
    
  }
});