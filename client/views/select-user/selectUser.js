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
  hasStay: function() {
    return !!Session.get('stayId');
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

    hideModal();
    $(document).trigger('cancel-user-selected');
  }
});