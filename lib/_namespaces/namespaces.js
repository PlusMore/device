var Aggregate = function() {
  this.Entities = {};
  this.Commands = {};
};

HotelGuestApp = {
  Aggregates: {},
  Integrations: {},
  Schemas: {},
  Events: new EventEmitter() // https://atmospherejs.com/raix/eventemitter,
};

PlusMore = {
  Services: {}
}

Schema = {};
