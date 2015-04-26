NavCategories = new Meteor.Collection('navCategories');

NavCategories.allow({
  insert: function(userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  update: function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove: function(userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  }
});
