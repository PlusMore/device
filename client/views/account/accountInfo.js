Template.accountInfo.helpers({
  title: function() {
    var user = Meteor.user();

    if (user && user.profile && user.profile.name) {
      return user.profile.name;
    } else {
      return "Account";
    }
    
  },
  isVisibleClass: function() {
    if (!!Session.get('accountInfo')) {
      
      if (Session.get('hideAccountInfo')) {
        return 'show in animated fadeOut';
      }
      
      return 'show in animated fadeIn';
    } else {
      return 'hidden';
    }
  },
  checkoutDate: function () {
    var stay = Stays.findOne(Session.get('stayId'));

    if (stay) {
      return moment(stay.checkoutDate).zone(stay.zone).calendar();
    }

  },
  emailAddress: function() {
    return this.emails[0].address;
  },
  duringStay: function() {
    return Session.get('stayId');
  },
  accountInfoSchema: function() {
    return Schema.accountInfo;
  }
});

Meteor.startup(function() {
  Tracker.autorun(function() {
    var showAccountInfo = !!Session.get('accountInfo');

    if (showAccountInfo) {
      Session.set('modalOpen', true);
    } else {
      Session.set('modalOpen', false);
    }
  });
});


var hideModal = function() {
  Session.set('hideAccountInfo', true);
  Meteor.setTimeout(function() {
    Session.set('accountInfo', undefined);
    Session.set('hideAccountInfo', false);
  }, 500);
}

Template.accountInfo.events({
  'click [data-dismiss="modal"]':function(e, tmpl){
    tmpl.$(tmpl.firstNode).trigger('hide-modal');
  },
  'hide-modal': function () {
    hideModal();
  },
  'click .js-logout': function(e, tmpl) {
    Meteor.logout();
    tmpl.$(tmpl.firstNode).trigger('hide-modal');
  }
});