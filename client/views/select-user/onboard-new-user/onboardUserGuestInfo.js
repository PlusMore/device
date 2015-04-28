Template.onboardUserGuestInfo.helpers({
  guestInfoSchema: function() {
    return Schema.guestInfo;
  }
});

Template.onboardUserGuestInfo.rendered = function () {
  // Convert all the links with the progress-button class to
  // actual buttons with progress meters.
  // You need to call this function once the page is loaded.
  // If you add buttons later, you will need to call the function only for them.
  this.$('button[type=submit]:first').progressInitialize();

  // debugger;
  var $container = $("#select-user");

  // Set up datepicker
  this.$('[name=checkoutDate]').pickadate({
    // today: false,
    container: $container,
    clear: false,
    min: moment({hour: 12, minute: 0}).add(1, 'days').toDate(),
    today: false,
    onSet: function(date) {
      console.log('on board user info rendered');
      if (date.select) {
        var selectedDate = moment(date.select).hour(12).minute(0).second(0).toDate();
        console.log(selectedDate);
        Session.set('checkoutDate', {
          date: selectedDate,
          zone: moment(selectedDate).zone()
        });
      }
    }
  });
};

AutoForm.hooks({
  guestInfo: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Session.set('onboardAccountCreationOptions', {
        profile: {
          firstName: insertDoc.firstName,
          lastName: insertDoc.lastName
        }
      });
      // Session.set('checkoutDate', insertDoc.checkoutDate);

      var parent = this.template.findParentTemplate('onboardUser');
      parent.$(parent.firstNode).trigger('onboard-step-guest-info-complete');
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
