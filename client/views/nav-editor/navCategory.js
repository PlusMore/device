Template.addNavCategory.events({
	"click #dismiss-modal": function (e) {
		e.preventDefault();
		modal.close();
	}
});

Template.editNavCategory.events({
	"click #dismiss-modal": function (e) {
		e.preventDefault();
		modal.close();
	}
});

AutoForm.hooks({
	addNavCategory: {
		onSuccess: function(operation, result, template) {
			modal.close();
		}
	},
	editNavCategory: {
		onSuccess: function(operation, result, template) {
			modal.close();
		}
	}
});
