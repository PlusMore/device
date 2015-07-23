Meteor.methods({
  addUserToStay: function(stayId) {
    console.log('add user to stay');
    var user = Meteor.user();

    if (user) {

      var stay = Stays.findOne(stayId);

      if (!stay) {
        throw new Meteor.Error(500, 'Stay not found.');
      }

      // if there are active stays for the user, clear them
      // could probably be a better solution
      // but I don't know what at this point.
      var activeStays = Stays.find({
        users: user._id,
        active: true
      });
      activeStays.forEach(function (stay) {
        Stays.update(stay._id, {$set: {active: false}});
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
  }
});
