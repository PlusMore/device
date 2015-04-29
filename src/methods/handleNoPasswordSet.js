Meteor.methods({
  handleNoPasswordSet: function(userId) {
    if (Meteor.isServer) {
      Accounts.sendResetPasswordEmail(userId);
    }
  }
});
