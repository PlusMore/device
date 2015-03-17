Template.menuCategory.helpers({
  isChecked: function() {
    // sets property 'checked' of input checkbox to 'checked' or ''
    // if not configured, return ''
    return this.active ? 'checked' : '';
  },
  isAvailableNow: function() {
    if (this.startMinutes && this.endMinutes) {
      var start = moment().startOf('day').minutes(this.startMinutes);
      var end = moment().startOf('day').minutes(this.endMinutes);
      var now = moment();
      return !!(now.isAfter(start) && now.isBefore(end));
    }
    return true;
  },
  hasMenuItems: function() {
    return MenuItems.find({
      menuCategoryId: this._id
    }).count() > 0;
  }
});

Template.menuCategory.events({
  'change #category-switch': function(e, tmpl) {
    if (tmpl.$(e.currentTarget).prop('checked')) {
      console.log('on');
      Meteor.call('activateMenuCategory', this._id);
    } else {
      console.log('off');
      Meteor.call('deactivateMenuCategory', this._id);
    }
  }
});
