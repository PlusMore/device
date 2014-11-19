Template.selectUser.helpers({
  isVisibleClass: function() {
    if (!!Session.get('selectUser')) {
      
      if (Session.get('hideSelectUser')) {
        return 'show in animated fadeOut';
      }

      // became visible, set to first step
      if (!Meteor.user()) {
        Session.set('onboardStep', 1);
      }
      
      return 'show in animated fadeIn';
    } else {
      return 'hidden';
    }
  }, 
  hasStay: function() {
    return !!Session.get('stayId');
  },
  stepOne: function() {
    return Session.equals('onboardStep', 1);
  },
  stepTwo: function() {
    return Session.equals('onboardStep', 2);
  },
  stepThree: function() {
    return Session.equals('onboardStep', 3);
  },
  finished: function() {
    return Session.equals('onboardStep', 'complete');
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
    $(document).trigger('cancel-user-selected');
    hideModal();
    
  }, 
  'click #btn-step-one': function(e, tmpl) {
    // debugger;
    tmpl.$(tmpl.firstNode).trigger('onboard-step-one-complete');
    
  },
  'onboard-step-one-complete': function(e, tmpl) {
    Session.set('onboardStep', 2);
  },
  'click #btn-step-two': function(e, tmpl) {
    // debugger;
    tmpl.$(tmpl.firstNode).trigger('onboard-step-two-complete');
    
  },
  'onboard-step-two-complete': function(e, tmpl) {
    Session.set('onboardStep', 3);
  },
  'click #btn-step-three': function(e, tmpl) {
    // debugger;
    tmpl.$(tmpl.firstNode).trigger('onboard-step-three-complete');
    
  },
  'onboard-step-three-complete': function(e, tmpl) {
    Session.set('onboardStep', 'complete');
    Meteor.setTimeout(function() {
      tmpl.$(tmpl.firstNode).trigger('onboard-complete');
    }, 2000);
  },
  'onboard-complete': function(e, tmpl) {
    $(document).trigger('user-selected');
    hideModal();
    Meteor.setTimeout(function() {
      Session.set('onboardStep', undefined);
    }, 2000);
  }
});