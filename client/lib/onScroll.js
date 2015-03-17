Meteor.startup(function() {
  var scrolling = false;

  document.body.addEventListener('touchmove', function(e) {
    if (!$(e.target).parents().hasClass("scrollable")) {
      e.preventDefault();
    } else if ($(e.target).is('input, textarea')) {
      e.preventDefault();
    } else {
      var $scrollable = $(e.target).parents('.scrollable:first');
      var scrollable = $scrollable[0];
      if (!scrolling) {
        console.log('else');
        scrolling = true;

        if (scrollable.scrollTop === 0 &&
          (scrollable.scrollHeight === scrollable.scrollTop + scrollable.offsetHeight)) {
          e.preventDefault();
        }
        if (scrollable.scrollTop === 0) {
          scrollable.scrollTop = 1;
        } else if (scrollable.scrollHeight === scrollable.scrollTop + scrollable.offsetHeight) {
          scrollable.scrollTop -= 1;
        }
        scrolling = false;
      }
    }
  }, false);
});
