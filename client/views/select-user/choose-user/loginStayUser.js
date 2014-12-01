Template.loginStayUser.helpers({
  guestPasswordSchema: function() {
    return Schema.guestPassword;
  },
  userName: function() {
    var userId = Session.get('selectedUserChoice');
    var user = Meteor.users.find(userId);

    return "{0} {1}".format(user.profile.firstName, user.profile.lastName);
  }
});

Template.loginStayUser.rendered = function () {
  // Convert all the links with the progress-button class to
  // actual buttons with progress meters.
  // You need to call this function once the page is loaded.
  // If you add buttons later, you will need to call the function only for them.
  this.$('button[type=submit]:first').progressInitialize();
};

AutoForm.hooks({
  loginStayUser: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      
      var parent = this.template.findParentTemplate('chooseUser');

      var levent = jQuery.Event('login-stay-user');
      levent.password = insertDoc.password;

      parent.$(parent.firstNode).trigger(levent);
    },
    // Called at the beginning and end of submission, respectively.
    // This is the place to disable/enable buttons or the form,
    // show/hide a "Please wait" message, etc. If these hooks are
    // not defined, then by default the submit button is disabled
    // during submission.
    beginSubmit: function(formId, template) {
      template.$('[type=submit]:first').progressStart();
    },
    endSubmit: function(formId, template) {
      template.$('[type=submit]:first').progressFinish();
    }
  }
});