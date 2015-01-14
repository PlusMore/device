NavCategories = new Meteor.Collection('navCategories');

NavCategories.allow({
  insert: function(userId, doc){
    return true;
  },
  update:  function(userId, doc, fieldNames, modifier){
    return true;
  },
  remove:  function(userId, doc){
    return false;
  }
});

Schema.NavCategory = new SimpleSchema({
  name: {
  	type: String
  },
  kioskOnly: {
  	type: Boolean
  },
  hotelService: {
  	type: Boolean
  },
  mobileOnly: {
  	type: Boolean
  },
  adminOnly: {
    type: Boolean
  }
});

NavCategories.attachSchema(Schema.NavCategory);

Meteor.methods({
  removeNavCategory: function (navCategoryId) {
    check(navCategoryId, String);

    return [
      NavCategories.remove(navCategoryId),
      NavLinks.remove({navCategoryId: navCategoryId})
    ];
  }
});