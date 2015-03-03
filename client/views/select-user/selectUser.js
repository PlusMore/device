Template.selectUser.helpers({
  hasStayWithUsers: function() {
    var isOnboarding = Session.get('onboarding');

    if (isOnboarding) {
      return false;
    }

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

Template.selectUser.rendered = function() {
  if (!Meteor.user()) {
    Session.set('onboardStep', undefined);
    Session.set('onboardStep', 'onboardUserGuestInfo');
  }
};

var hideModal = function() {
  modal.close();
  Session.set('selectedUserChoice', undefined);
};

Template.selectUser.events({
  'click [data-dismiss="modal"]': function(e, tmpl) {
    console.log('dismiss');

    tmpl.$(tmpl.firstNode).trigger('hide-modal');
    $(document).trigger('cancel-user-selected');
  },
  'hide-modal': function() {
    hideModal();
  }
});
