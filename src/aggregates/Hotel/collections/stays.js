Stays = new Meteor.Collection('stays'); // could pass in hotelService when we move collection
Stays.service = PlusMore.Services.HotelService;

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

Stays.endStay = function(stayId, callback) {
  Stays.service.call('endStay', stayId, function(err, result) {
    if (err) {
      return Errors.throw(err);
    }

    if (typeof callback === 'function') {
      return callback(err, result);
    }
  });
};

Stays.addUserToStay = function(stayId, callback) {
  console.log('add user to stay');
  Stays.service.call('addUserToStay', stayId, function(err, result) {
    if (err) {
      return Errors.throw(err);
    }

    if (typeof callback === 'function') {
      return callback(err, result);
    }
  });
};

Stays.stayOver = function(stayId, callback) {
  Stays.service.call('stayOver', stayId, function(err, result) {
    if (err) {
      return Errors.throw(err);
    }

    if (typeof callback === 'function') {
      return callback(err, result);
    }
  });
};

Stays.registerStay = function(deviceId, checkoutDate) {
  Stays.service.call('registerStayFromDevice', deviceId, checkoutDate, function(err, result) {
    if (err) {
      return Errors.throw(err);
    }

    if (typeof callback === 'function') {
      return callback(err, result);
    }
  });
};
