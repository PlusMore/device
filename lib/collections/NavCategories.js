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
  	type: String,
    label: "Category Name"
  },
  menuRank: {
    type: Number,
    label: "Menu Rank",
    allowedValues: [1,2,3,4,5,6,7],
    autoform: {
      options: [
        {label: "1", value: 1},
        {label: "2", value: 2},
        {label: "3", value: 3},
        {label: "4", value: 4},
        {label: "5", value: 5},
        {label: "6", value: 6},
        {label: "7", value: 7}
      ]
    }
  },
  kioskOnly: {
  	type: Boolean,
    label: "Kiosk"
  },
  hotelService: {
  	type: Boolean,
    label: "Service"
  },
  mobileOnly: {
  	type: Boolean,
    label: "Mobile"
  },
  adminOnly: {
    type: Boolean,
    label: "Admin"
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