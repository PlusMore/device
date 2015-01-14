Template.navLink.events({
  'click #edit-nav-link': function(e) {
    e.preventDefault();
    modal.show('editNavLink', this);
  },
  'click #delete-nav-link': function(e) {
    e.preventDefault();
    if (confirm("Are you sure?")){
      NavLinks.remove(this._id);
    }
  }
});

Template.addNavLink.events({
  'click #dismiss-modal': function (e) {
    e.preventDefault();
    modal.close();
  }
});

Template.editNavLink.events({
  "click #dismiss-modal": function (e) {
    e.preventDefault();
    modal.close();
  }
});

AutoForm.hooks({
  addNavLink: {
    onSuccess: function(operation, result, template) {
      modal.close();
    }
  },
  editNavLink: {
    onSuccess: function(operation, result, template) {
      modal.close();
    },
    onError: function(operation, error, template) {
      console.log('error');
      console.log(error.message);
    }
  }
});
