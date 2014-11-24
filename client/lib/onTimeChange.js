Meteor.startup(function () {
  Tracker.autorun(function () {
    var time = Session.get('currentTime');
    var stayId = Session.get('stayId');

    var stay = Stays.findOne(stayId);
    if (stay) {
      if (moment(time).zone(stay.zone) > moment(stay.checkoutDate).zone(stay.zone)) {
        Meteor.call('stayOver', stayId, function(err) {
          if (err) {
            throw new Meteor.Error(500, 'Unable to end stay');
          }

          Session.set('stayId', undefined);
          Meteor.logoutOtherClients();
          Meteor.logout();
        });
      }
    }
  })
  
});