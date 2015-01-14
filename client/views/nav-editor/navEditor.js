Template.navEditor.helpers({
	navCategories: function () {
		return NavCategories.find();
	},
	navLinks: function () {
		return NavLinks.find({navCategoryId: this._id});
	}
});

Template.navEditor.events({
	'click #new-nav-category': function(e) {
		modal.show('addNavCategory', null);
	},
	'click #edit-nav-category': function(e) {
		e.preventDefault();
		modal.show('editNavCategory', this);
	},
	'click #delete-nav-category': function(e) {
		e.preventDefault();
		if (confirm("This will also delete all links under this category")){
			Meteor.call('removeNavCategory', this._id);
		}
	},
	'click #add-nav-link': function(e) {
		e.preventDefault();
		//modal.show('addNavLink', null);
	}
});