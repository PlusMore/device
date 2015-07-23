Template.navLink.events({
  'click #edit-nav-link': function(e) {
    e.preventDefault();
    modal.show('editNavLink', this);
  },
  'click #delete-nav-link': function(e) {
    e.preventDefault();
    if (confirm("Are you sure?")) {
      NavLinks.remove(this._id);
    }
  }
});

Template.addNavLink.events({
  'click #dismiss-modal': function(e) {
    e.preventDefault();
    modal.close();
  }
});

Template.addNavLink.helpers({
  routeOptions: function() {
    return _.map(getRouteNames(), function(c, i) {
      return {
        label: c,
        value: c
      };
    });
  },
  categoryOptions: function() {
    return Categories.find().map(function(c) {
      return {
        label: c.name,
        value: c._id
      };
    });
  }
});

Template.editNavLink.events({
  "click #dismiss-modal": function(e) {
    e.preventDefault();
    modal.close();
  }
});

AutoForm.hooks({
  addNavLink: {
    onSuccess: function(operation, result) {
      modal.close();
    },
    onError: function(operation, error) {
      console.log('error');
      console.log(error.message);
    }
  },
  editNavLink: {
    onSuccess: function(operation, result) {
      modal.close();
    },
    onError: function(operation, error) {
      console.log('error');
      console.log(error.message);
    }
  }
});
