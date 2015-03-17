/* ---------------------------------------------------- +/

## Items ##

All code related to the Items collection goes here.

/+ ---------------------------------------------------- */

Categories = new Meteor.Collection('categories');

Categories.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return false;
  },
  remove: function(userId, doc) {
    return false;
  }
});
