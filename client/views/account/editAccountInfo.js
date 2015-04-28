Template.editAccountInfo.helpers({
  emailAddress: function() {
    return this.emails[0].address;
  },
  firstName: function() {
    return this.profile.firstName;
  },
  lastName: function() {
    return this.profile.lastName;
  },
  accountInfoSchema: function() {
    return Schema.accountInfo;
  }
});

Template.editAccountInfo.events({
  'click #cancel-edit-account': function(e) {
    Session.set('editingAccountInfo', false);
  }
});

AutoForm.hooks({
  editAccountForm: {
    onSuccess: function(operation, result) {
      Session.set('editingAccountInfo', false);
    }
  }
});
