Meteor.users.helpers({
  displayName: function() {
    return this.profile.firstName + ' ' + this.profile.lastName;
  }
});
