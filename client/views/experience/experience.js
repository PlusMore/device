Template.experience.helpers({
  // subscriptionsReady: function() {
  //   if (subscriptions && (subscriptions.stayInfo  && typeof subscriptions.stayInfo !== 'undefined') && (subscriptions.deviceData && typeof subscriptions.deviceData !== 'undefined')) {
  //     return subscriptions.stayInfo.ready() && subscriptions.deviceData.ready();
  //   }
  // },
  isVisibleClass: function() {
    if (!!Session.get('currentExperienceId')) {
      if (Session.get('fadeOutExperience')) {
        return 'fadeOut';
      }
      return 'fadeIn';
    } else {
      return 'fadeOut';
    }
  },
  experience: function() {
    return Experiences.findOne(Session.get('currentExperienceId'));
  }
});

var handleBack = function (e, tmpl) {
  e.preventDefault();
  Session.set('fadeOutExperience', true);
  Meteor.setTimeout(function() {
    Session.set('currentExperienceId', undefined);
    Session.set('fadeOutExperience', false);
  }, 500);
};

var events = {};
events[clickevent + " a.back"] = handleBack;

Template.experience.events(events);

Meteor.startup(function() {
  Tracker.autorun(function() {
    var currentExperienceId = Session.get('currentExperienceId');

    if (currentExperienceId) {
      subscriptions.experience = Meteor.subscribe('experience', currentExperienceId);
    } else {
      if (subscriptions && subscriptions.experience && subscriptions.experience.stop) {
        subscriptions.experience.stop();
      }
    }
  });
})