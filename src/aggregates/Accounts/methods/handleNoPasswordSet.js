Meteor.methods({
  handleNoPasswordSet: function(userId) {
    if (Meteor.isServer) {
      return Accounts.sendResetPasswordEmail(userId);
    }
  }
});
