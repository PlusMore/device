Template.onboardUserGuestPassword.helpers({
  guestPasswordSchema: function() {
    return Schema.guestPassword;
  }
});

Template.onboardUserGuestPassword.rendered = function () {
  // Convert all the links with the progress-button class to
  // actual buttons with progress meters.
  // You need to call this function once the page is loaded.
  // If you add buttons later, you will need to call the function only for them.
  this.$('button[type=submit]:first').progressInitialize();
};

AutoForm.hooks({
  guestPassword: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      var accountOptions = Session.get('onboardAccountCreationOptions');

      accountOptions = _.extend(accountOptions, {
        password: insertDoc.password
      });
      Session.set('onboardAccountCreationOptions', accountOptions);

      var parent = this.template.findParentTemplate('onboardUser');
      parent.$(parent.firstNode).trigger('onboard-step-guest-password-complete');
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
