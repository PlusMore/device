Template.deviceLayout.helpers({
  needsRegistration: function() {
    return !Meteor.user().deviceId;
  },
  idleStatus: function() {
    return UserStatus.isIdle() ? 'idle' : ''
  },
  isIdle: function() {
    return UserStatus.isIdle();
  },
  connectionStatus: function () {
    return Meteor.status().status;
  },
  experiencesOverlays: function() {
    return Experiences.find();
  },
  categories: function() {
    return Categories.find();
  },
  // additionalContentClasses: function() {
  //   var currentRoute = Router.current(); 

  //   if (currentRoute) { 
  //     return currentRoute.route.name === 'experience' ? 'hinge animated' : 'fadeIn animated';
  //   }
  // },
  isFullscreen: function() {
    return Session.get('fullscreen') ? 'fullscreen' : '';
  },
  isScrollable: function() {
    // when not fullscreen - allow scrolling
    return Session.get('fullscreen') ? '' : 'scrollable';
  }
});

Template.preload.helpers({
  experiences: function () {
    return Experiences.find();
  }
});

