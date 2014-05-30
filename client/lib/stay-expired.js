Meteor.startup(function() {
  Deps.autorun(function() {
    var expired = Session.get('expired');
    var stay = Deps.nonreactive(function() { 
      return Stays.findOne({userId: Meteor.userId()});
    });

    if (stay && expired) {
      console.log('expired');
      App.track("Stay Over", {
        "checkInDate": stay.checkInDate,
        "checkoutDate": stay.checkoutDate
      });
      Meteor.call('endStay', stay, function (err, deviceId) {
        if (err) throw new Meteor.Error(err)

        Meteor.logout();

        Meteor.loginDevice(deviceId, function(err) {
          if (err) throw new Meteor.Error(500, 'Device login failed');
          Session.set('expired', false);

          Router.go('welcome');
        });
      });
    }
  });
});
  
// Meteor.call('changeCheckoutDate', Stays.findOne()._id, moment().toDate())