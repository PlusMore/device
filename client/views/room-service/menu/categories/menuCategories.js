Template.menuCategories.helpers({
  timedMenuCategories: function() {
    return MenuCategories.find({
      startTime: {
        $exists: true
      }
    }, {
      sort: {
        startMinutes: 1
      }
    });
  },
  anytimeMenuCategories: function() {
    return MenuCategories.find({
      startTime: {
        $exists: false
      }
    });
  },
  noMenuCategories: function() {
    return MenuCategories.find().count() === 0;
  }
});
