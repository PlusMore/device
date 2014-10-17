Template.experiences.helpers({
  experiencesLayout: function () {
    if (this.category) {
      if (this.category.filterGroupTags && this.category.filterGroupTags.length > 0) {
        return "subnavContentLayout";
      }
    }
    return "contentLayout";
  },
  hasSubnav: function () {
    if (this.category) {
      if (this.category.filterGroupTags && this.category.filterGroupTags.length > 0) {
        return true;
      }
    }
    return false;
  }
}); 

Template.experiences.rendered = function () {
  console.log('maybe here would be better?');
};