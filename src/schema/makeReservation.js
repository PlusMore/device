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
