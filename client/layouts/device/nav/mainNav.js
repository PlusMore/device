Template.mainNav.helpers({
  navCategories: function() {
    return NavCategories.find({}, {
      sort: {
        menuRank: 1
      }
    });
  }
});
