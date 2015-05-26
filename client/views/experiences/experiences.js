Template.experiences.helpers({
  experiencesLayout: function() {
    if (ResponsiveHelpers.isXs()) {
      // these are broken on mobile ios, so just don't show for now
      return 'contentLayout';
    }

    if (this.category) {
      if (this.category.filterGroupTags && this.category.filterGroupTags.length > 0) {
        return 'subnavContentLayout';
      }
    }
    return 'contentLayout';
  },
  hasSubnav: function() {
    if (this.category) {
      if (this.category.filterGroupTags && this.category.filterGroupTags.length > 0) {
        return true;
      }
    }
    return false;
  }
});
