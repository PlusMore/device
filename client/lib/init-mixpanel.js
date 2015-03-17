Meteor.startup(function() {
  // Initialize Mixpanel Analytics
  if (mixpanel) {
    mixpanel.init(Meteor.settings.public.mixpanel);
  }
});
