NavLinks = new Meteor.Collection('navLinks');

NavCategories.allow({
  insert: function(userId, doc){
    return Roles.userIsInRole(userId, 'admin');
  },
  update:  function(userId, doc, fieldNames, modifier){
    return Roles.userIsInRole(userId, 'admin');
  },
  remove:  function(userId, doc){
    return Roles.userIsInRole(userId, 'admin');
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
  	type: Object
  }
});

NavLinks.attachSchema(Schema.NavLink);
