Template.navEditor.helpers({
  navCategories: function() {
    return NavCategories.find({}, {
      sort: {
        menuRank: 1
      }
    });
  }
});

Template.navEditor.events({
  'click #new-nav-category': function(e) {
    e.preventDefault();
    modal.show('addNavCategory', null);
  }
});

Template.navEditor.onCreated(function() {
  this.subscribe('navCategories');
  this.subscribe('navLinks');
});
