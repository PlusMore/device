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
  showActionForm: function() {
    var experienceState = Session.get('experienceState');
    if (experienceState === 'in-progress' || experienceState === 'complete' || experienceState === 'error') {
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

Template.callToActionButton.helpers(_.extend(callToActionHelpers, {}));
Template.experienceActionForm.helpers(_.extend(callToActionHelpers, {}));
Template.experienceDetails.helpers(_.extend(callToActionHelpers, {}));