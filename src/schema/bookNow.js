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
