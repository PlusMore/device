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
};

var closestHeight = function(containerWidth, containerHeight, aspectRatioNumerator) {
  // we can't be too specific with heights because there are too
  // many variations, from browser chromes, and things like
  // "your hotspot is on" so instead we will support an aspect ration
  // that will recursively shrink to fit to the viewport
  var width = closestWidth(containerWidth);

  //the image should be 16:9 (width:height) aspect ratio
  // fomula to calculate the height is:
  //      width*(aspectRatioHeight/aspectRatioWidth)
  aspectRatioNumerator = aspectRatioNumerator || 9;
  var aspectRatioFormula = (aspectRatioNumerator / 16);

  var height = width * aspectRatioFormula;

  // while the margin will cause the content to be offscreen or height
  // is offscreen, go down a size by recursively calling with
  // at least 150 pixels should show
  while (contentOffsetTop(height) > (containerHeight * (5 / 8))) {
    height = closestHeight(width, containerHeight, aspectRatioNumerator - 1);
  }

  return height;
};

var contentOffsetTop = function(height) {
  var navbarheight = 65;
  return height + navbarheight - 50;
};

Template.hotelInformation.helpers({
  hotel: function() {
    return Hotels.findOne();
  },
  amenities: function() {
    return HotelAmenities.find();
  },
  bgImgWidth: function() {
    var containerWidth = ResponsiveHelpers.deviceWidth();
    var width = closestWidth(containerWidth);
    return 'w=' + width;
  },
  bgImgHeight: function() {
    var containerHeight = ResponsiveHelpers.deviceHeight();
    var containerWidth = ResponsiveHelpers.deviceWidth();
    var height = closestHeight(containerWidth, containerHeight);
    return 'h=' + height;
  },
  contentSpacerCss: function() {
    // same as the imgheight - 10px + top-margin (65px)
    var containerHeight = ResponsiveHelpers.deviceHeight();
    var containerWidth = ResponsiveHelpers.deviceWidth();
    var height = closestHeight(containerWidth, containerHeight);

    var offsetTop = contentOffsetTop(height);

    return 'height:' + offsetTop + 'px;';
  }
});

Template.hotelInformation.onCreated(function() {
  var hotel = Hotels.findOne();
  this.subscribe('hotelAmenities', hotel._id);
  this.subscribe('amenityDetails', hotel._id);
})
