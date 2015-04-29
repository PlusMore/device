Meteor.publish('hotelMenuForStay', function(stayId) {
  var userId = this.userId,
    user = Meteor.users.findOne(userId);

  var stay = Stays.findOne(stayId);

  if (stay) {
    var hotel = Hotels.find(stay.hotelId);
    if (hotel) {

      var menuCategoriesCursor = MenuCategories.find({
        hotelId: stay.hotelId,
        active: true
      });

      var categoryIds = [];

      menuCategoriesCursor.map(function(category) {
        categoryIds.push(category._id);
      });

      return [
        menuCategoriesCursor,
        MenuItems.find({
          menuCategoryId: {
            $in: categoryIds
          },
          active: true
        })
      ];
    }
  }
});
