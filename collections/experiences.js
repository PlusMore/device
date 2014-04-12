/* ---------------------------------------------------- +/

## Experiences ##

All code related to the Experiences collection goes here.

/+ ---------------------------------------------------- */

Experiences = new Meteor.Collection('experiences');
// Allow/Deny

Experiences.allow({
  insert: function(userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  update:  function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove:  function(userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  }
});


