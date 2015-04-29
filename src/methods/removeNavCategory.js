Meteor.methods({
  removeNavCategory: function(navCategoryId) {
    check(navCategoryId, String);

    return [
      NavCategories.remove(navCategoryId),
      NavLinks.remove({
        navCategoryId: navCategoryId
      })
    ];
  }
});
