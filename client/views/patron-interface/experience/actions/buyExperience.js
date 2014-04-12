Template.buyExperienceCallToAction.events({
  'click .btn': function(e, tmpl) {
    e.preventDefault();
    console.log('Buy experience button clicked');
    mixpanel.track("Started Purchase Process");
    Session.set('experienceState', 'in-progress');
  }
});