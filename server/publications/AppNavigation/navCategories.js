Meteor.publish('navCategories', function() {
  return NavCategories.find();
});
