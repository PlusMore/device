/* ---------------------------------------------------- +/

## Hotels ##

All code related to the Hotels collection goes here.

/+ ---------------------------------------------------- */

Hotels = new Meteor.Collection('hotels');

Hotels.allow({
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
