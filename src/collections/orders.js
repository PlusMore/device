Orders = new Meteor.Collection('orders');

// Schemas


Schema.makeReservation = new SimpleSchema({
  partySize: {
    type: Number,
    min: 1
  },
  date: {
    type: Date
  },
  zone: {
    type: Number
  },
  experienceId: {
    type: String
  }
});

Schema.bookNow = new SimpleSchema({
  partySize: {
    type: Number,
    min: 1
  },
  start: {
    type: Date
  },
  end: {
    type: Date
  },
  zone: {
    type: Number
  },
  experienceId: {
    type: String
  }
});

Schema.purchase = new SimpleSchema({
  type: {
    type: String
  },
  handledBy: {
    type: String
  },
  date: {
    type: Date
  },
  zone: {
    type: Number
  }
});

Schema.service = new SimpleSchema({
  type: {
    type: String
  },
  handledBy: {
    type: String
  },
  date: {
    type: Date
  },
  zone: {
    type: Number
  }
});

Schema.Order = new SimpleSchema({
  open: {
    type: Boolean
  },
  requestedDate: {
    type: Date
  },
  requestedZone: {
    type: Number
  },
  receivedDate: {
    type: Date,
    optional: true
  },
  receivedBy: {
    type: String,
    optional: true
  },
  completedDate: {
    type: Date,
    optional: true
  },
  completedBy: {
    type: String,
    optional: true
  },
  cancelledDate: {
    type: Date,
    optional: true
  },
  cancelledBy: {
    type: String,
    optional: true
  },
  deviceId: {
    type: String,
    optional: true
  },
  hotelId: {
    type: String,
    optional: true
  },
  stayId: {
    type: String,
    optional: true
  },
  roomId: {
    type: String,
    optional: true
  },
  userId: {
    type: String
  },
  type: {
    type: String
  },
  status: {
    type: String,
    optional: true
  },
  reservation: {
    type: Object,
    optional: true,
    blackbox: true
  },
  purchase: {
    type: Object,
    optional: true,
    blackbox: true
  },
  service: {
    type: Object,
    optional: true,
    blackbox: true
  },
  handledBy: {
    type: String,
  }
});

Orders.attachSchema(Schema.Order);

// Allow/Deny

Orders.allow({
  insert: function(userId, doc) {
    return userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return userId === doc.userId;
  },
  remove: function(userId, doc) {
    return false;
  }
});
