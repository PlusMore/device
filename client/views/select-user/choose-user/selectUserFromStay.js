Template.selectUserFromStay.helpers({
  users: function() {
    var stayId = Session.get('stayId');
    return Meteor.users.find({stayId: stayId});
  }
});