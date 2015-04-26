//  nav categories and links
Meteor.publish('nav', function() {
  return [
    NavCategories.find(),
    NavLinks.find()
  ];
});
