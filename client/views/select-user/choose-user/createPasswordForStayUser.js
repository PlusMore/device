Template.createPasswordForStayUser.helpers({
  userName: function() {
    var userId = Session.get('selectedUserChoice');
    var user = Meteor.users.findOne(userId);
    if (user && user.profile) {
      return "{0} {1}".format(user.profile.firstName, user.profile.lastName);
    }

    return "No User Selected";
  },
  guestPasswordSchema: function() {
    return Schema.guestPassword;
  }
});

AutoForm.hooks({
  createPasswordForStayUser: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      var parent = this.template.findParentTemplate('chooseUser');

      var cevent = jQuery.Event('create-stay-user-password');
      cevent.password = insertDoc.password;

      parent.$(parent.firstNode).trigger(cevent);
    },
    // Called at the beginning and end of submission, respectively.
    // This is the place to disable/enable buttons or the form,
    // show/hide a "Please wait" message, etc. If these hooks are
    // not defined, then by default the submit button is disabled
    // during submission.
    beginSubmit: function() {
      this.template.$('[type=submit]:first').progressStart();
    },
    endSubmit: function() {
      this.template.$('[type=submit]:first').progressFinish();
    }
  }
});
