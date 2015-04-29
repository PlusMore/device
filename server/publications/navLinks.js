Meteor.publish('navLinks', function() {
  return NavLinks.find();
});
