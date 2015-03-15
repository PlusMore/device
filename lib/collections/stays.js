Stays = new Meteor.Collection('stays');

Stays.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc, fields, modifier) {
    return userId === doc.userId;
  },
  remove: function(userId, doc) {
    return false;
  }
});

Meteor.methods({
  registerStay: function(deviceId, checkoutDate) {
    check(deviceId, String);
    check(checkoutDate, {
      date: Date,
      zone: Number
    });

    var device = Devices.findOne(deviceId);
    if (!device) {
      throw new Meteor.Error(500, 'Not a valid device');
    }

    if (device.stayId) {
      var stay = Stays.findOne(device.stayId);

      if (stay) {
        if (moment().zone(checkoutDate.zone) < moment(stay.checkoutDate.date).zone()) {
          // this device already has a registered stay
          // if no users, allow it to be overwritten

          if (stay.users.length > 0)
            throw new Meteor.Error(500, 'This device\'s current stay has not ended.');
        }
      }
    }

    var hotel = Hotels.findOne(device.hotelId);
    if (!hotel) {
      throw new Meteor.Error(500, 'Not a valid hotel');
    }

    Stays.update({
      deviceId: deviceId
    }, {
      $set: {
        active: false
      }
    });
    var stayId = Stays.insert({
      checkInDate: new Date(),
      checkoutDate: checkoutDate.date,
      zone: checkoutDate.zone,
      hotelId: hotel._id,
      deviceId: device._id,
      active: true
    });

    Devices.update(device._id, {
      $set: {
        stayId: stayId
      }
    });


    return stayId;
  },
  addUserToStay: function(stayId) {
    var user = Meteor.user();

    if (user) {

      var stay = Stays.findOne(stayId);

      if (!stay) {
        throw new Meteor.Error(500, 'Stay not found.');
      }

      Stays.update({
        users: user._id
      }, {
        $set: {
          active: false
        }
      });
      Meteor.users.update(user._id, {
        $set: {
          stayId: stay._id
        }
      });
      var stayId = Stays.update(stay._id, {
        $addToSet: {
          users: user._id
        }
      });

      this.unblock();

      if (Meteor.isServer) {
        var url = stripTrailingSlash(Meteor.settings.apps.device.url);
        var hotel = Hotels.findOne(stay.hotelId);
        var email = user.emails[0].address;

        Email.send({
          to: email,
          bcc: 'info@plusmoretablets.com',
          from: "noreply@plusmoretablets.com",
          subject: "Your Stay at {0}\n\n".format(hotel.name),
          text: "{0} {1},\n\n".format(user.profile.firstName, user.profile.lastName) +
            "Thanks for choosing {0}. ".format(hotel.name) +
            "You may also access PlusMore from your mobile device!\n\n" +
            "{0}\n\n".format(url) +
            "Use PlusMore to manage your stay on the go!"
        });
      }

      return stayId;

    } else {
      throw new Meteor.Error(403, 'Not logged in.');
    }
  },
  stayOver: function(stayId) {
    var stay = Stays.findOne(stayId);

    // if stay is over, end it.
    if (moment().zone(stay.zone) > moment(stay.checkoutDate).zone(stay.zone)) {
      Stays.update(stayId, {
        $set: {
          active: false
        }
      });
      Devices.update(stay.deviceId, {
        $unset: {
          stayId: 1
        }
      });
      if (stay.users && stay.users.length > 0) {
        Meteor.users.update({
          _id: {
            $in: stay.users
          }
        }, {
          $unset: {
            stayId: 1
          }
        });
      }
    }
  },
  endStay: function(stayId) {
    return Stays.update(stayId, {
      $set: {
        checkoutDate: new Date(),
        active: false
      }
    });
  },
  changeCheckoutDate: function(stayId, checkoutDate) {
    check(stayId, String);
    check(checkoutDate, Date);
    Stays.update(stayId, {
      $set: {
        checkoutDate: checkoutDate
      }
    });
  }
});
