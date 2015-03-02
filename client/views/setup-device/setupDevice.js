Template.setupDeviceForm.helpers({
  setupDeviceSchema: function() {
    return Schema.setupDevice;
  },
  hotelOptions: function() {
    var hotels = Hotels.find().fetch();
    var hotelOptions = [];

    _.each(hotels, function(hotel) {
      hotelOptions.push({
        label: hotel.name,
        value: hotel._id
      });
    });

    return hotelOptions;
  },
  roomOptions: function() {
    var hotelId = AutoForm.getFieldValue('setupDeviceForm', 'hotelId');
    var rooms = Rooms.find().fetch();
    var roomOptions = [];
    if (rooms) {
      _.each(rooms, function(room) {
        roomOptions.push({
          label: room.name,
          value: room._id
        })
      })
      return roomOptions;
    }
  },
  hotelSelected: function() {
    return AutoForm.getFieldValue('setupDeviceForm', 'hotelId');
  }
});

Template.setupDeviceForm.created = function() {
  var template = this;

  template.autorun(function() {
    var selectedHotelId = AutoForm.getFieldValue('setupDeviceForm', 'hotelId');

    Meteor.subscribe('roomsByHotelId', selectedHotelId);
  });
};

AutoForm.hooks({
  setupDeviceForm: {
    onSuccess: function(operation, deviceId, template) {
      // log out the current hotel staff

      // Session.keys = {};
      // Router.go('settingUp');
      Session.set('loader', 'Registering Device');

      Meteor.setTimeout(function() {
        Meteor.logout(function() {

          LocalStore.set('deviceId', deviceId);
          LocalStore.set('kiosk', true);

          Router.go('welcome');
          Session.set('loader', undefined);

        });
      }, 1000);

    },
    onError: function(operation, error, template) {
      if (error.reason) Errors.throw(error.reason);
    }
  }
});
