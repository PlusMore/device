Template.addNewGuest.helpers({
  newGuestSchema: function() {
    return Schema.newGuest;
  },
  accountExists: function () {
    var addNewGuestTemplate = Template.instance().findParentTemplate('addNewGuest');

    var accountExists = addNewGuestTemplate.accountExists.get();
    return !!accountExists;
  },
  hasEmail: function () {
    var addNewGuestTemplate = Template.instance().findParentTemplate('addNewGuest');
    var hasEmail = addNewGuestTemplate.hasEmail.get();
    return !!hasEmail;
  },
  showAccountExists: function () {
    var addNewGuestTemplate = Template.instance().findParentTemplate('addNewGuest');
    var accountExists = addNewGuestTemplate.accountExists.get();
    if (!!accountExists) {
      return 'show in animated fadeIn';
    } else {
      return 'hidden';
    }
  },
  showProfileForm: function() {
    var addNewGuestTemplate = Template.instance().findParentTemplate('addNewGuest');
    var firstName = addNewGuestTemplate.firstName.get();
    var lastName = addNewGuestTemplate.lastName.get();
    var hasEmail = addNewGuestTemplate.hasEmail.get();
    if ((!firstName || !lastName) && (!!hasEmail)) {
      return 'show in animated fadeIn';
    } else {
      return 'hidden';
    }
  },
  showPasswordForm: function() {
    var addNewGuestTemplate = Template.instance().findParentTemplate('addNewGuest');
    var hasEmail = addNewGuestTemplate.hasEmail.get();

    if (!!hasEmail) {
      return 'show in animated fadeIn';
    } else {
      return 'hidden';
    }
  },
  userName: function() {
    var addNewGuestTemplate = Template.instance().findParentTemplate('addNewGuest');
    var firstName = addNewGuestTemplate.firstName.get();
    var lastName = addNewGuestTemplate.lastName.get();

    return "{0} {1}".format(firstName, lastName);
  }
});

Template.addNewGuest.rendered = function () {
  // Convert all the links with the progress-button class to
  // actual buttons with progress meters.
  // You need to call this function once the page is loaded.
  // If you add buttons later, you will need to call the function only for them.
  this.$('button[type=submit]:first').progressInitialize();

  var that = this;
  this.autorun(function() {
    var firstName = that.firstName.get() || "";
    that.$('[name=firstName]').val(firstName);
  });

  this.autorun(function() {
    var lastName = that.lastName.get() || "";
    that.$('[name=lastName]').val(lastName);
  });
};

Template.addNewGuest.created = function () {
  this.accountExists = new ReactiveVar(undefined);
  this.hasEmail = new ReactiveVar(false);

  this.firstName = new ReactiveVar(undefined);
  this.lastName = new ReactiveVar(undefined);

  var that = this;
  // update autoform fields with first and last name if we get them some other way;
}

Template.addNewGuest.events({
  'change [name=emailAddress]': function (e, tmpl) {
    var email = tmpl.$(e.currentTarget).val();

    if (!email) {
      tmpl.accountExists.set(false);
      tmpl.hasEmail.set(false);
      return;
    }

    Meteor.call('getProfile', email, function(err, userProfile) {
      if (err) return Errors.throw('Something went wrong.');

      console.log('got profile', userProfile);
      tmpl.accountExists.set(!!userProfile);

      if (!!userProfile) {
        tmpl.firstName.set(userProfile.firstName);
        tmpl.lastName.set(userProfile.lastName);
      } else {
        tmpl.firstName.set(undefined);
        tmpl.lastName.set(undefined);
      }

      tmpl.hasEmail.set(true);
    });
  }
});

AutoForm.hooks({
  addNewGuestToStay: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      var parent = this.template.findParentTemplate('chooseUser');
      var addNewGuestTmpl = Template.instance().findParentTemplate('addNewGuest');

      var levent = jQuery.Event('add-new-user');
      levent.accountExists = addNewGuestTmpl.accountExists.get();
      levent.previousFirstName = addNewGuestTmpl.firstName.get();
      levent.previousLastName = addNewGuestTmpl.lastName.get();
      levent.formData = insertDoc;

      parent.$(parent.firstNode).trigger(levent);
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
