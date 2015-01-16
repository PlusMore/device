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
