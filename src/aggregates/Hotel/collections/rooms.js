Rooms = new Meteor.Collection('rooms');

// Allow/Deny

Rooms.allow({
  insert: function(userId, doc) {
    return Roles.userIsInRole(userId, ['hotel-manager', 'admin']);
  },
  update: function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['hotel-manager', 'admin']);
  },
  remove: function(userId, doc) {
    return false;
  }
});

Rooms.helpers({
  stay: function() {
    return Stays.findOne(this.stayId);
  }
});
