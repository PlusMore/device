/* ---------------------------------------------------- +/

## Items ##

Code related to the items template

/+ ---------------------------------------------------- */

Template.experiences.created = function () {
  //
};

Template.experiences.helpers({
  //
});

Template.experiences.rendered = function () {
  //
};

Template.experiences.events({
  'click .experience': function(e) {
    return;
    e.preventDefault();

    var rect = e.currentTarget.getBoundingClientRect(),
        $currentTarget = $(e.currentTarget);

    if (!$currentTarget.hasClass('selected')) {
      Session.set('showConfirmation', false);
//    First we set position to absolute and the coordinate
//    values from getBoundingRect. This makes the div stay in the
//    same position, but is now absolute so the animation can expand
//    to fill the screen.
      $(e.currentTarget)
        .css('position', 'fixed')
        .css('top', rect.top)
        .css('right', rect.right)
        .css('bottom', rect.bottom)
        .css('left', rect.left);
      $currentTarget.addClass('selected');
      $currentTarget.removeClass('unselected');

      $currentTarget.find('.content').addClass('col-xs-12 col-md-5');

      Session.set('lastScrollPosition', $('body').scrollTop());
      $('body').scrollTop(0);
    }
    else {

      if (! $(e.target).closest('.content').length) {
        $currentTarget.addClass('unselected');
        $currentTarget.removeClass('selected');
        $('body').scrollTop(Session.get('lastScrollPosition'));

        $currentTarget.find('.content').removeClass('col-md-5');
  //      TODO: on animationend event remove .css() props
        $(e.currentTarget)
          .css('position', '')
          .css('top', '')
          .css('right', '')
          .css('bottom', '')
          .css('left', '');
      }
    }
  }
});