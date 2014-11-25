Template.selectUser.helpers({
  isVisibleClass: function() {
    if (!!Session.get('selectUser')) {
      
      if (Session.get('hideSelectUser')) {
        return 'show in animated fadeOut';
      }

      // became visible, set to first step

      if (!Meteor.user()) {
        Session.set('onboardStep', undefined);
        Session.set('onboardStep', 'onboardUserGuestInfo');
      }
      
      return 'show in animated fadeIn';
    } else {
      return 'hidden';
    }
  }, 
  hasStayWithUsers: function() {
    var stayId = Session.get('stayId');
    var stays = Stays.find(stayId);
    if (stays.count() > 0) {
      var stay = Stays.findOne(stayId);
      if (stay.users && stay.users.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
});



var hideModal = function() {
  Session.set('hideSelectUser', true);
  Meteor.setTimeout(function() {
    Session.set('selectUser', undefined);
    Session.set('hideSelectUser', false);
  }, 500);
}

Template.selectUser.events({
  'click [data-dismiss="modal"]':function(e, tmpl){
    console.log('dismiss');

    tmpl.$(tmpl.firstNode).trigger('hide-modal');
    $(document).trigger('cancel-user-selected');
  },
  'hide-modal': function () {
    hideModal();
  }
});