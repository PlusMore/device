NavLinks = new Meteor.Collection('navLinks');

NavLinks.allow({
  insert: function(userId, doc){
    return false;
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
  	type: String,
    label: "Route Name"
  },
  linkRank: {
    type: Number,
    label: "Link Rank",
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
  icon: {
  	type: String,
    label: "Menu Icon"
  },
  routeName: {
  	type: String,
    label: "Route Path"
  },
  isAdmin: {
    type: Boolean,
    label: "Admin"
  },
  isKiosk: {
    type: Boolean,
    label: "Kiosk"
  },
  isMobile: {
    type: Boolean,
    label: "Mobile"
  },
  hotelService: {
    type: Boolean,
    label: "Service"
  },
  routeData: {
  	type: Object,
    optional: true
  },
  "routeData.categoryId": {
    type: String,
    label: "Experience Category"
  }
});

NavLinks.attachSchema(Schema.NavLink);

Meteor.methods({
  addNavLink: function (doc) {
    if (doc.routeData) {
      var category = Categories.findOne(doc.routeData.categoryId);
      doc.name = category.name;
      doc.icon = category.iconClass;
    }
    return [
      NavLinks.insert(doc)
    ];
  }
});
