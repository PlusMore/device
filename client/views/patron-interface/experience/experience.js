Template.experience.rendered = function () {
  AutoForm.addHooks([this.data._id], {
    formToDoc: function(doc) {
      console.log('form to doc');

      var dateval = $("#"+doc.experienceId).find('[name=dateDatetime]').val();
      if (dateval) {
        timeMinutes = doc.timeMinutes;

        if (timeMinutes) {
          var m = moment(dateval).minutes(timeMinutes);
          if (m.isValid()) {
            // before 6am - add day
            if (doc.timeMinutes < (60*6)) {
              m.add('days', 1);
            }
            doc.dateDatetime = m.toDate();
          }
        }
        
      }
      
      return doc;
    },
    onSuccess: function(operation, result, template) {
      Session.set('experienceState', 'complete');
      AutoForm.resetForm(result.reservation.experienceId);
    }
  });
};

var callToActionHelpers = {
  callToActionIsReserve: function() {
    return this.callToAction === "reserve";
  },
  callToActionIsPurchase: function() {
    return this.callToAction === "purchase";
  }
}

Template.experience.helpers(_.extend(callToActionHelpers, {
  experienceState: function() {
    return Session.get('experienceState');
  },
  activeExperienceClass: function() {
    if (Router.current().route.name) {
      if (Router.current().params._id === this._id) {
        return 'show';
      }
    }
  },
  showContent: function() {
    if (Router.current().route.name) {
      if (Router.current().params._id === this._id) {
        return true;
      }
    }

    return false;
  },
  showActionForm: function() {
    var experienceState = Session.get('experienceState');
    var currentExperienceId = Session.get('currentExperienceId');
    if (this._id === currentExperienceId && (experienceState === 'in-progress' || experienceState === 'complete')) {
      return 'show';
    }
  }
}));

Template.experience.events({
  'click .close': function (e, tmpl) {
    e.preventDefault();
    mixpanel.track("Close button clicked");
    Session.set('experienceState', '');
  }
});

Template.experienceDetails.helpers(_.extend(callToActionHelpers, {}));