Template.authenticateStayUser.helpers({
  hasPassword: function () {
    var userId = Session.get('selectedUserChoice');
    var user = Meteor.users.findOne(userId);

    if (!user)
      return false;
    
    return (!!user.services.password.bcrypt);
  }
});