Template.navCategoryUI.helpers({
  displayNavCategory: function() {
    var user = Meteor.user();
    var kiosk = LocalStore.get('kiosk');
    var hotel = Hotels.findOne();
    var navLinksCount = NavLinks.find({navCategoryId: this._id}).count();

    // if no links, no need to render category
    if (navLinksCount < 1) {
      return false;
    }

    if (this.adminOnly) {
      return Roles.userIsInRole(Meteor.user(), ['admin']);
    }

    if (this.requiresHotelData) {
      return !!hotel;
    }

    return true;
  },
  navLinks: function () {
    return NavLinks.find({navCategoryId: this._id});
  },
  expanded: function() {
    return !ResponsiveHelpers.isXs();
  },
  expandedClass: function() {
    return !ResponsiveHelpers.isXs() ? 'in' : '';
  }
});