Schema.addHotelStaff = new SimpleSchema({
  email: {
    type: String,
    regEx: SchemaRegEx.Email,
    label: "E-mail address"
  },
  hotelId: {
    type: String
  }
});

Meteor.methods({
  addHotelStaff: function (user) {
    check(user, Schema.addHotelStaff);

    if (!this.isSimulation) {
      var roles = ['hotel-staff', 'device-manager']
      var userId = Accounts.createUser({
        email: user.email,
        roles: roles,
        password: Meteor.uuid()
      });

      Meteor.users.update(userId, {$set: {hotelId: user.hotelId}});
      Roles.addUsersToRoles(userId, roles);
      Accounts.sendEnrollmentEmail(userId, user.email)
      return userId;
    }
  }
});