Template.accountInfo.helpers({
  title: function() {
    var user = Meteor.user();

    if (user && user.profile && user.profile.firstName && user.profile.lastName) {
      return "{0} {1}".format(user.profile.firstName, user.profile.lastName);
    } else {
      return "Account";
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
  firstName: function() {
    return this.profile.firstName;
  },
  lastName: function() {
    return this.profile.lastName;
  },
  duringStay: function() {
    return Session.get('stayId');
  },
  accountInfoSchema: function() {
    return Schema.accountInfo;
  }
});

Template.accountInfo.events({
  'click [data-dismiss="modal"]':function(e, tmpl){
    tmpl.$(tmpl.firstNode).trigger('hide-modal');
  },
  'hide-modal': function () {
    modal.close();
  },
  'click .js-logout': function(e, tmpl) {
    Meteor.logout();
    tmpl.$(tmpl.firstNode).trigger('hide-modal');
  }
});