NavLinks = new Meteor.Collection('navLinks');

NavLinks.allow({
  insert: function(userId, doc){
    return true;
  },
  update:  function(userId, doc, fieldNames, modifier){
    return true;
  },
  remove:  function(userId, doc){
    return true;
  }
});

Schema.NavLink = new SimpleSchema({
  navCategoryId: {
    type: String,
  },
  name: {
  	type: String
  },
  icon: {
  	type: String
  },
  routeName: {
  	type: String
  },
  routeData: {
  	type: Object,
    optional: true
  }
});

NavLinks.attachSchema(Schema.NavLink);
