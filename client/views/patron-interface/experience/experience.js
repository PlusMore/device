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
    var currentRoute = Router.current().route.name;
    

    if (currentRoute === 'experience') {
      if (Router.current().params._id === this._id) {
        return 'show';
      } else {
        return '';
      }
    } else {
      return '';
    }
  },
  showActionForm: function() {
    var experienceState = Session.get('experienceState');
    var currentExperienceId = Session.get('currentExperienceId');
    if (this._id === currentExperienceId && (experienceState === 'in-progress' || experienceState === 'complete' || experienceState === 'error')) {
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