var subs = new SubsManager();

var closestWidth = function(containerWidth) {
  // iphones/ipads are common and pretty standard, so we'll support those
  // and we will support plusmore kiosk device sizes
  // other browsers will be whatever is closest to one of these sizes

  // although our site is mobile first responsive, we need to 
  // reverse it for serving the images, that way the images are scaled down
  // rather than scaled up

  var width = 1920; // 1080p display

  // android tablet horizontal
  if (containerWidth <= 1280) {
    width = 1280;
  }

  // ipad horizontal 
  if (containerWidth <= 1024) {
    width = 1024;
  }

  // android tablet vertical 
  if (containerWidth <= 800) {
    width = 800;
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
  // we can't be too specific with heights because there are too
  // many variations, from browser chromes, and things like 
  // "your hotspot is on" so instead we will support an aspect ration
  // that will recursively shrink to fit to the viewport
  var width = closestWidth(containerWidth);

  //the image should be 16:9 (width:height) aspect ratio
  // fomula to calculate the height is:
  //      width*(aspectRatioHeight/aspectRatioWidth)
  var aspectRatioFormula = (9/16);
  // if container's width is greater than height, than we want to
  // use a tighter aspect ratio of 16:7
  if (containerWidth > containerHeight) {
    aspectRatioFormula = (7/16);
  }

  var height = width*aspectRatioFormula;

  // while the margin will cause the content to be offscreen or height 
  // is offscreen, go down a size by recursively calling with 
  // 50 less pixels from the width
  while (contentOffsetTop(height) > containerHeight) {
    height = closestHeight(width - 50, containerHeight);
  }

  return height;
}

var contentOffsetTop = function(height) {
  var navbarheight = 65;
  return height + navbarheight - 10;
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
    var height = closestHeight(containerWidth, containerHeight);

    var offsetTop = contentOffsetTop(height);

    return 'margin-top:'+offsetTop+'px;'
  },
  modalOpen: function() {
    return (Session.get('modalOpen') || modal.open()) ? 'modal-open' : '';
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