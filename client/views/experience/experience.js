var subs = new SubsManager();

Template.experience.helpers({
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
  console.log('back');
  e.preventDefault();
  e.stopImmediatePropagation();

  Session.set('fadeOutExperience', true);
  Meteor.setTimeout(function() {
    Session.set('currentExperienceId', undefined);
    Session.set('fadeOutExperience', false);
  }, 500);

  return false;
};

var events = {};
events[clickevent + " a.back"] = handleBack;

Template.experience.events(events);

Meteor.startup(function() {
  Tracker.autorun(function() {
    var currentExperienceId = Session.get('currentExperienceId');

    if (currentExperienceId) {
      subscriptions.experience = subs.subscribe('experience', currentExperienceId);
    } else {
      if (subscriptions && subscriptions.experience && subscriptions.experience.stop) {
        subscriptions.experience.stop();
      }
    }
  });
})