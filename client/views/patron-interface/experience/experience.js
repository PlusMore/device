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