Template.navEditor.helpers({
	navCategories: function () {
		return NavCategories.find();
	}
});

Template.navEditor.events({
	'click #new-nav-category': function(e) {
		e.preventDefault();
		modal.show('addNavCategory', null);
	}
});