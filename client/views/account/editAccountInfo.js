Template.editAccountInfo.helpers({
  emailAddress: function() {
    return this.emails[0].address;
  },
  firstName: function() {
    return this.profile.firstName;
  },
  lastName: function() {
    return this.profile.lastName;
  },
  accountInfoSchema: function() {
    return Schema.accountInfo;
  }
});