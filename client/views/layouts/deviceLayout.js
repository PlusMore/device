Template.deviceLayout.helpers({
  idleStatus: function() {
    return UserStatus.isIdle() ? 'idle' : ''
  },
  isIdle: function() {
    return UserStatus.isIdle();
  },
  connectionStatus: function () {
    return Meteor.status().status;
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
  },
  hotelPhotoUrl: function() {
    var hotelsCursor = Hotels.find();

    if (hotelsCursor.count() > 0) {
      var hotel = Hotels.findOne();
      if (hotel) {
        if (hotel.photoUrl) {
          return hotel.photoUrl + '/convert?w=1024&h=768&fit=scale&cache=true';
        }
      }
    } 
      
    return '/backgrounds/body-bg-blue.png';
  }
});

Template.preload.helpers({
  experiences: function () {
    return Experiences.find();
  }
});

