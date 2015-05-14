Stays = new Meteor.Collection('stays');

Stays.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc, fields, modifier) {
    return userId === doc.userId;
  },
  remove: function(userId, doc) {
    return false;
  }
});

Stays.helpers({
  hotel: function() {
    return Hotels.findOne(this.hotelId);
  },
  room: function() {
    return Rooms.findOne(this.roomId);
  },
  isActive: function() {
    var now = Session.get('currentTime') || new Date();
    var checkin = moment(this.checkInDate).zone(this.zone);
    var checkout = moment(this.checkoutDate).zone(this.zone);
    if (checkin <= now && now <= checkout) {
      return true;
    }
    return false;
  }
});

Stays.currentStayForUserId = function(userId) {
  return Stays.findOne({users: userId, active: true});
};

Stays.endStay = function(stayId) {
  var hotelService = Cluster.discoverConnection('hotel');
  hotelService.call('endStay', stayId, function(err, result) {
    if (err) {
      return Errors.throw(err);
    }
  });
};

Stays.addUserToStay = function(stayId, callback) {
  var hotelService = Cluster.discoverConnection('hotel');
  hotelService.call('addUserToStay', stayId, function(err, result) {
    if (err) {
      return Errors.throw(err);
    }

    if (callback) {
      return callback(err, result);
    }
  })
};
