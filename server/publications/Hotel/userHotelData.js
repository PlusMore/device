// Used to get list of available hotels to register a device
// Admin returns all, hotel-staff returns the user's hotel
Meteor.publish('userHotelData', function() {
  var userId = this.userId;

  if (userId) {

    // if admin, publish all hotels
    // if hotel staff, only publish that hotel
    if (Roles.userIsInRole(userId, 'admin')) {
      return Hotels.find();
    } else if (Roles.userIsInRole(userId, 'hotel-staff')) {
      var fields = {
          hotelId: 1
        },
        user = Meteor.users.findOne({
          _id: userId
        }),
        hotelId = user && user.hotelId || null;
      if (hotelId) {
        return [
          Meteor.users.find({
            _id: userId
          }, {
            fields: fields
          }),
          Hotels.find({
            _id: hotelId
          })
        ];
      } else {
        this.ready();
        return null;
      }
    }

  } else {
    this.ready();
    return null;
  }
});
