Schema.newGuest = new SimpleSchema({
  firstName: {
    type: String,
    label: 'First Name'
  },
  lastName: {
    type: String,
    label: 'Last Name'
  },
  emailAddress: {
    type: String,
    label: "Email Address"
  },
  password: {
    type: String,
    min: 8
  }
});
