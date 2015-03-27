Meteor.startup(function() {
  Tracker.autorun(function() {
    var time = Session.get('currentTime');
    var stays = Stays.find();
    var stay = Stays.findOne();
    var stayId = stay._id;

    var stay = Stays.findOne(stayId);
    if (stay) {
      if (moment(time).zone(stay.zone) > moment(stay.checkoutDate).zone(stay.zone)) {
        Meteor.call('stayOver', stayId, function(err) {
          if (err) {
            throw new Meteor.Error(500, 'Unable to end stay');
          }

          App.track("Stay Over", {
            "checkInDate": stay.checkInDate,
            "checkoutDate": stay.checkoutDate
          });

          if (LocalStore.get('kiosk')) {
            Meteor.logout();
          } else {
            LocalStore.set('deviceId', undefined);
          }
        });
      }
    }
  });
});
