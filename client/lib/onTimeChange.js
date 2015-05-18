var checkIfStayHasExpired = function(time, stay) {
  var now = moment(time).zone(stay.zone);
  var checkoutDate = moment(stay.checkoutDate).zone(stay.zone);
  if (now > checkoutDate) {
    Stays.stayOver(stay._id, function(err, result) {
      if (err) {
        return Errors.throw('Unable to end stay');
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

Meteor.startup(function() {
  Tracker.autorun(function() {
    var time = Session.get('currentTime');
    var stays = Stays.find();
    var stay = Stays.findOne();

    if (stay) {
      checkIfStayHasExpired(time, stay);
    }
  });
});
