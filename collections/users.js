Schema.accountInfo = new SimpleSchema({
  firstName: {
    type: String,
    label: 'First'
  },
  lastName: {
    type: String,
    label: 'Last'
  },
  emailAddress: {
    type: String,
    label: "Email Address"
  }
});

Meteor.methods({
  addInfoToDeviceAccountAndSubmitReservation: function(info) {
    check(info, Schema.accountInfo);

    console.log('oh shit', info);
  }
});