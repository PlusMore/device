/* ---------------------------------------------------- +/

## Publications ##

All publications-related code.

/+ ---------------------------------------------------- */

//  nav categories and links
Meteor.publish('nav', function() {
  return [
    NavCategories.find(),
    NavLinks.find()
  ];
});


// Used to get list of available hotels to register a device
// Admin returns all, hotel-staff returns the user's hotel
Meteor.publish('userHotelData', function() {
  var userId = this.userId;

  if (userId) {

    // if admin, publish all hotels
    // if hotel staff, only publish that hotel
    if (Roles.userIsInRole(userId, 'admin')) {
      return Hotels.find();
    } else if (Roles.userIsInRole(userId, 'hotel-staff')) {
      var fields = {
          hotelId: 1
        },
        user = Meteor.users.findOne({
          _id: userId
        }),
        hotelId = user && user.hotelId || null;
      if (hotelId) {
        return [
          Meteor.users.find({
            _id: userId
          }, {
            fields: fields
          }),
          Hotels.find({
            _id: hotelId
          })
        ];
      } else {
        this.ready();
        return null;
      }
    }

  } else {
    this.ready();
    return null;
  }
});

Meteor.publish('activeStaysByHotelId', function(hotelId) {
  var now = new Date();

  return Stays.find({
    hotelId: hotelId,
    checkInDate: {
      $lte: now
    },
    checkoutDate: {
      $gte: now
    },
    zone: {
      $exists: true
    }
  });
});

Stays._ensureIndex('users');

Meteor.publish('stayInfo', function(stayId) {
  var fields = {
    stayId: 1
  };

  return [
    Stays.find(stayId),
    Meteor.users.find({
      stayId: stayId
    })
  ];
});

Meteor.publish('device', function(deviceId) {
  console.log('publishing device data for ' + deviceId);
  if (deviceId) {
    var device = Devices.findOne(deviceId);
    if (device) {
      return [
        Devices.find(deviceId)
      ];
    } else {
      console.log('no device data found for ' + deviceId);
    }
  }
});

Meteor.publish('room', function(roomId) {
  console.log('publishing room data for ' + roomId);
  if (roomId) {
    var room = Rooms.findOne(roomId);
    if (room) {
      return [
        Rooms.find(roomId)
      ];
    } else {
      console.log('no room data found for ' + roomId);
    }
  }
});

Meteor.publish('stay', function(stayId) {
  console.log('publishing stay data for ' + stayId);
  if (stayId) {
    var stay = Stays.findOne(stayId);
    if (stay) {
      return [
        Stays.find(stayId),
        Meteor.users.find({
          stayId: stayId
        })
      ];
    } else {
      console.log('no stay data found for ' + stayId);
    }
  }
});

Meteor.publish('hotel', function(hotelId) {
  console.log('publishing hotel data for ' + hotelId);
  if (hotelId) {
    var hotel = Hotels.findOne(hotelId);
    if (hotel) {
      return [
        Hotels.find(hotelId),
        HotelServices.find({
          hotelId: hotelId,
          active: true
        })
      ];
    } else {
      console.log('no hotel data found for ' + hotelId);
    }
  }
});

Meteor.publish('userStays', function() {
  return [
    Stays.find({
      users: this.userId,
      active: true
    })
  ];
});

Meteor.publish('roomForStay', function(stayId) {
  return [
    Rooms.find({
      stayId: stayId
    })
  ];
});

Meteor.publish('deviceByStayId', function(stayId) {
  var stay = Stays.findOne(stayId);

  if (stay) {
    var room = Rooms.findOne({
      stayId: stayId
    });

    if (room) {
      var device = Devices.findOne({
        roomId: room._id
      });

      if (device) {
        return [
          Devices.find({
            roomId: room._id
          }),
          Hotels.find(room.hotelId),
          Rooms.find({
            stayId: stayId
          }),
          HotelServices.find({
            hotelId: room.hotelId,
            active: true
          })
        ];
      }
    }
  }

});

Meteor.publish('roomsByHotelId', function(hotelId) {
  return Rooms.find({
    hotelId: hotelId
  });
});

Meteor.publish('experiencesData', function(categoryId, stateCode) {
  var experienceFields = {
    active: 1,
    category: 1,
    lead: 1,
    photoUrl: 1,
    title: 1
  };

  var experiencePublishFields = {
    active: 1,
    categoryId: 1,
    geo: 1,
    lead: 1,
    photoUrl: 1,
    sortOrder: 1,
    tagGroups: 1,
    title: 1,
    yelpId: 1,
    phone: 1
  };

  var tagGroups = Meteor.tags.find({
    group: {
      $exists: true
    }
  });
  var tagGroupsArray = [];
  tagGroups.forEach(function(tag) {
    if (tag.group && tagGroupsArray.indexOf(tag.group) === -1) {
      tagGroupsArray.push(tag.group);
    }
  });

  _.each(tagGroupsArray, function(tagGroup) {
    if (tagGroup !== 'filterGroup') {
      experiencePublishFields[tagGroup + 'Tags'] = 1;
    }
  });

  return [
    Categories.find({
      active: true
    }),
    Experiences.find({
      active: true,
      categoryId: categoryId,
      "geo.stateCode": stateCode
    }, {
      fields: experiencePublishFields
    })
  ];
});

Meteor.publish('experience', function(experienceId) {
  return [
    Experiences.find(experienceId),
    PlusMoreAssets.find({
      type: 'experience',
      refId: experienceId
    })
  ];
});

Meteor.publish('orders', function() {
  return [
    Orders.find({
      userId: this.userId
    })
  ];
});

Meteor.publish('ordersRecent', function() {
  var now = new Date();
  return [
    Orders.find({
      userId: this.userId,
      $or: [{
        open: true
      }, {
        "service.date": {
          $gt: now
        }
      }, {
        "reservation.date": {
          $gt: now
        }
      }]
    })
  ];
});

Meteor.publish('ordersHistory', function() {
  return [
    Orders.find({
      userId: this.userId
    })
  ];
});

Meteor.publish('hotelAmenities', function(hotelId) {
  return HotelAmenities.find({
    hotelId: hotelId
  });
});

Meteor.publish('amenityDetails', function(hotelId) {
  return AmenityDetails.find({
    hotelId: hotelId
  });
});

Meteor.publish('navCategories', function() {
  return NavCategories.find();

});

Meteor.publish('navLinks', function() {
  return NavLinks.find();
});

Meteor.publish('hotelMenu', function(hotelId) {
  var userId = this.userId,
    user = Meteor.users.findOne(userId);

  var hotel = Hotels.find(hotelId);
  if (hotel) {

    var publication = new SimplePublication({
      subHandle: this,
      collection: MenuCategories,
      selector: {
        hotelId: hotelId,
        active: true
      },
      dependant: new SimplePublication({
        subHandle: this,
        collection: MenuItems,
        selector: {
          active: true
        },
        foreignKey: 'menuCategoryId'
      })
    }).start();
  }
});

Meteor.publish('hotelMenuForStay', function(stayId) {
  var userId = this.userId,
    user = Meteor.users.findOne(userId);

  var stay = Stays.findOne(stayId);

  if (stay) {
    var hotel = Hotels.find(stay.hotelId);
    if (hotel) {
      var publication = new SimplePublication({
        subHandle: this,
        collection: MenuCategories,
        selector: {
          hotelId: stay.hotelId,
          active: true
        },
        dependant: new SimplePublication({
          subHandle: this,
          collection: MenuItems,
          selector: {
            active: true
          },
          foreignKey: 'menuCategoryId'
        })
      }).start();
    }
  }

});

Meteor.publish('cart', function(cartId) {
  return CartItems.find({
    cartId: cartId
  });
});
