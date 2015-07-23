Template.setupDevice.helpers({
  setupDeviceSchema: function() {
    return Schema.setupDevice;
  },
  hotelOptions: function() {
    var hotelsCursor = Hotels.find();
    var hotels = hotelsCursor.fetch();
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
    var hotelId = Session.get('kioskSetupFormSelectedHotelId');
    var roomsCursor = Rooms.find({hotelId: hotelId}, {$sort: {name: 1}});
    var stays = Stays.find();
    var rooms = roomsCursor.fetch();
    var roomOptions = [];
    if (rooms) {
      _.each(rooms, function(room) {
        var active = '';
        if (room.stay() && room.stay().isActive()) { //collection helper
          active = ' (has active stay)';
        }
        roomOptions.push({
          label: room.name + active,
          value: room._id
        });
      });
      return roomOptions;
    }
  },
  hotelSelected: function() {
    return !!Session.get('kioskSetupFormSelectedHotelId');
  },
  hotelServiceDDP: function() {
    return PlusMore.Services.HotelService;
  }
});

Template.setupDevice.onCreated(function() {
  var self = this;
  self.subscribe('userHotelData');

  self.autorun(function() {
    var selectedHotelId = Session.get('kioskSetupFormSelectedHotelId');
    if (!!selectedHotelId) {
      self.subscribe('roomsByHotelId', selectedHotelId);
      self.subscribe('activeStaysByHotelId', selectedHotelId);
    }
  });
});

Template.setupDevice.events({
  'change #select-hotel': function(e, tmpl) {
    e.preventDefault();
    if (tmpl.$(e.currentTarget).val() != "none") {
      Session.set('kioskSetupFormSelectedHotelId', tmpl.$(e.currentTarget).val());
    } else {
      Session.set('kioskSetupFormSelectedHotelId', undefined);
    }
  }
});

AutoForm.hooks({
  setupDeviceForm: {
    onSuccess: function(operation, deviceId) {
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
    onError: function(operation, error) {
      if (error.reason) Errors.throw(error.reason);
    }
  }
});
