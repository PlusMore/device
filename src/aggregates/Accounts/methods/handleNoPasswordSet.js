Meteor.methods({
  handleNoPasswordSet: function(userId) {
    this.unblock(); // don't need to wait for the server to send the email
    if (Meteor.isServer) {
      return Accounts.sendResetPasswordEmail(userId);
    }
  }
});
