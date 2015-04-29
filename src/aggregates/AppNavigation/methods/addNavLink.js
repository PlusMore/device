Meteor.methods({
  addNavLink: function(doc) {
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
