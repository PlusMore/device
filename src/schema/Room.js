Schema.Room = new SimpleSchema({
  name: {
    type: String,
    label: "Name"
  },
  hotelId: {
    type: String
  },
  stayId: {
    type: String,
    optional: true // can't unset if not optional
  }
});

Rooms.attachSchema(Schema.Room);
