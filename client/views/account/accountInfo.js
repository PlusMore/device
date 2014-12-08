Template.accountInfo.helpers({
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
  }
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