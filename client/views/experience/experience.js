Template.experience.helpers({
  subscriptionsReady: function() {
    if (subscriptions && (subscriptions.stayInfo  && typeof subscriptions.stayInfo !== 'undefined') && (subscriptions.deviceData && typeof subscriptions.deviceData !== 'undefined')) {
      return subscriptions.stayInfo.ready() && subscriptions.deviceData.ready();
    }
  },
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

Template.experience.events({
  'click a.back': function (e) {
    e.preventDefault();
    Session.set('fadeOutExperience', true);
    Meteor.setTimeout(function() {
      Session.set('currentExperienceId', undefined);
      Session.set('fadeOutExperience', false);
    }, 500);
  }
});