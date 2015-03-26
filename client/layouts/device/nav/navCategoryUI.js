Template.navCategoryUI.helpers({
  displayNavCategory: function() {
    var navLinksCount = NavLinks.find({
      navCategoryId: this._id
    }).count();

    // if no links, no need to render category
    if (navLinksCount < 1) {
      return false;
    }

    return Nav.checkPermissions(this);
  },
  navLinks: function() {
    return NavLinks.find({
      navCategoryId: this._id
    }, {
      sort: {
        linkRank: 1
      }
    });
  },
  expanded: function() {
    return !ResponsiveHelpers.isXs();
  },
  expandedClass: function() {
    return !ResponsiveHelpers.isXs() ? 'in' : '';
  }
});

Template.navCategoryUI.events({
  'click .js-nav-category': function(e, tmpl) {
    if (ResponsiveHelpers.isXs()) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    return false;
  }
});
