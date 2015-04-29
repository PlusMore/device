PlusMoreAssets = new Meteor.Collection('assets');

// Allow/Deny

PlusMoreAssets.allow({
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
