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

Schema.newGuest = new SimpleSchema({
   firstName: {
    type: String,
    label: 'First Name'
  },
  lastName: {
    type: String,
    label: 'Last Name'
  },
  emailAddress: {
    type: String,
    label: "Email Address"
  },
  password: {
    type: String,
    min: 8
  }
});

Schema.guestInfo = new SimpleSchema({
  firstName: {
    type: String,
    label: 'First Name'
  },
  lastName: {
    type: String,
    label: 'Last Name'
  },
  checkoutDate: {
    type: String,
    label: 'Checkout Date'
  }
});

Schema.guestNotifications = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

Schema.guestPassword = new SimpleSchema({
  password: {
    type: String,
    min: 8
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
    
  },
  editUserName: function(doc) {
    check(doc, Schema.accountInfo);

    var fullName = "{0} {1}".format(doc.firstName, doc.lastName);

    Meteor.users.update(this.userId, {
      $set: {
        'profile.name': fullName,
        'profile.firstName': doc.firstName,
        'profile.lastName': doc.lastName
      }
    });

    return true;
  },
  doesUserExist: function(email) {
    var user = Meteor.users.findOne({'emails.address': email});
    if (user) {
      return user._id;
    } else {
      return false;
    }
  },
  getProfile: function(email) {
    var user = Meteor.users.findOne({'emails.address': email});
    if (user) {
      return user.profile;
    } else {
      return false;
    }
  } 
});