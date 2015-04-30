Orders = new Meteor.Collection('orders');

// Allow/Deny

Orders.allow({
  insert: function(userId, doc) {
    return userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return userId === doc.userId;
  },
  remove: function(userId, doc) {
    return false;
  }
});
