/* ---------------------------------------------------- +/

## Experiences ##

All code related to the Experiences collection goes here.

/+ ---------------------------------------------------- */

Experiences = new Meteor.Collection('experiences');

Experiences.allow({
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
