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

Schema.guestInfo = new SimpleSchema({
  firstName: {
    type: String,
    label: 'First Name'
  },
  lastName: {
    type: String,
    label: 'Last Name'
  },
  checkoutDate: {
    type: String,
    label: 'Checkout Date'
  }
});

Schema.guestNotifications = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

Schema.guestPassword = new SimpleSchema({
  password: {
    type: String,
    min: 8
  }
});
