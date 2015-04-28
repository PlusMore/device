Template.navCategory.helpers({
  navLinks: function() {
    return NavLinks.find({
      navCategoryId: this._id
    }, {
      sort: {
        linkRank: 1
      }
    });
  }
});

Template.navCategory.events({
  'click #edit-nav-category': function(e) {
    e.preventDefault();
    modal.show('editNavCategory', this);
  },
  'click #delete-nav-category': function(e) {
    e.preventDefault();
    if (confirm("This will also delete all links under this category")) {
      Meteor.call('removeNavCategory', this._id);
    }
  },
  'click #add-nav-link': function(e) {
    e.preventDefault();
    modal.show('addNavLink', this);
  }
});

Template.addNavCategory.events({
  'click #dismiss-modal': function(e) {
    e.preventDefault();
    modal.close();
  }
});

Template.editNavCategory.events({
  'click #dismiss-modal': function(e) {
    e.preventDefault();
    modal.close();
  }
});

AutoForm.hooks({
  addNavCategory: {
    onSuccess: function(operation, result) {
      modal.close();
    }
  },
  editNavCategory: {
    onSuccess: function(operation, result) {
      modal.close();
    }
  }
});
