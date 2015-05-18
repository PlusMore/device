Schema.setupDevice = new SimpleSchema({
  hotelId: {
    type: String
  },
  replacement: {
    type: Boolean,
    label: 'Replacement device?'
  },
  roomId: {
    type: String
  }
});
