Meteor.methods({
  "getUserByToken": function(loginToken) {
    console.log('get user by token');
    var hashedToken = loginToken && Accounts._hashLoginToken(loginToken);
    var selector = {'services.resume.loginTokens.hashedToken': hashedToken};
    var options = {fields: {_id: 1}};

    var user = Meteor.users.findOne(selector, options);
    return (user)? user._id : null;
  }
});
