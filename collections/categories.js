/* ---------------------------------------------------- +/

## Items ##

All code related to the Items collection goes here.

/+ ---------------------------------------------------- */

Categories = new Meteor.Collection('categories', {
  schema: new SimpleSchema({
    name: {
      type: String,
      label: 'Name'
    },
    active: {
      type: Boolean,
      label: 'Show this category in device dashboard'
    },
    iconClass: {
      type: String,
      label: 'Icon Class'
    }
  })
});

// Allow/Deny

Categories.allow({
  insert: function(userId, doc){
    return Roles.userIsInRole(userId, ['admin']);
  },
  update:  function(userId, doc, fieldNames, modifier){
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove:  function(userId, doc){
    return Roles.userIsInRole(userId, ['admin']);
  }
});
