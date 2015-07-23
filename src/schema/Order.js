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
