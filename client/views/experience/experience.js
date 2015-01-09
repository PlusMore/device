var subs = new SubsManager();

var closestWidth = function(containerWidth) {
  // iphones/ipads are common and pretty standard, so we'll support those
  // and we will support plusmore kiosk device sizes
  // other browsers will be whatever is closest to one of these sizes

  // although our site is mobile first responsive, we need to 
  // reverse it for serving the images, that way the images are scaled down
  // rather than scaled up

  var width = 1200; //large device 

  // ipad horizontal 
  if (containerWidth <= 1024) {
    width = 1024;
  }

  // ipad vertical
  if (containerWidth <= 768) {
    width = 768;
  }
  
  // iphone 6+
  if (containerWidth <= 414) {
    width = 414;
  }
  
  // iphone 6
  if (containerWidth <= 375) {
    width = 375;
  }

  // original iphone
  if (containerWidth <= 320) {
    width = 320;
  }

  return width;
}

var closestHeight = function (containerWidth, containerHeight) {
  // we can't be as specific with heights because there are too
  // many variations, from browser chromes, and things like 
  // "your hotspot is on" so instead we will support 

  //the image should be close to 16:9 ration
  var width = closestWidth(containerWidth);
  var height = width*(9/16);

  return height;
}

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
  },
  stickBookNow: function() {
    return Session.get('stickBookNow');
  },
  bgImgWidth: function() {
    var containerWidth = ResponsiveHelpers.deviceWidth();
    var width = closestWidth(containerWidth);
    return 'w='+width;
  },
  bgImgHeight: function() {
    var containerHeight = ResponsiveHelpers.deviceHeight();
    var containerWidth = ResponsiveHelpers.deviceWidth();
    var height = closestHeight(containerWidth, containerHeight);
    return 'h='+height;
  },
  contentTopMarginCss: function() {
    // same as the imgheight - 10px + top-margin (65px)
    var containerHeight = ResponsiveHelpers.deviceHeight();
    var containerWidth = ResponsiveHelpers.deviceWidth();
    var height = closestHeight(containerWidth, containerHeight) + 65 - 10;

    return 'margin-top:'+height+'px;'
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
events[clickevent + " .js-back"] = handleBack;

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