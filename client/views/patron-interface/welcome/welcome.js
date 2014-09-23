Template.welcome.helpers({
  device: function() {
    if (Meteor.user()) {
      var deviceId = Meteor.user().deviceId;
      return Devices.findOne(deviceId);
    }
  },
  needsRegistration: function() {
    if (Meteor.user()) {
      return !Meteor.user().deviceId;
    }
  },
  hotelName: function() {
    var hotel = Hotels.findOne();
    return hotel.name;
  }
});

Template.welcome.events({
  'click .welcome': function (e) {
    e.preventDefault();

    App.begin();
  }
});