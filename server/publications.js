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

/**
 * Always publish logged-in users stayId, Stay info, device info, device data, hotel data, and hotel-service data
 *
 */
Meteor.publish(null, function() {
  var userId = this.userId;

  if (userId) {
    var fields = {
        stayId: 1
      },
      user = Meteor.users.findOne({
        _id: userId
      }),
      stayId = user && user.stayId || null;


    if (stayId) {

      var stay = Stays.find(stayId);

      if (stay) {
        return [
          Meteor.users.find(userId, {
            fields: fields
          }),
          Stays.find({
            _id: stayId,
            active: true
          })
        ];
      }

    } else {
      this.ready();
      return null;
    }
  } else {
    this.ready();
    return null;
  }
});

Stays._ensureIndex('users');

Meteor.publish('stayInfo', function(stayId) {
  var fields = {
    stayId: 1
  }

  return [
    Stays.find(stayId),
    Meteor.users.find({
      stayId: stayId
    })
  ];
});

Meteor.publish('userStays', function() {
  return [
    Stays.find({
      users: this.userId,
      active: true
    })
  ];
});

// Meteor.publish('userStays', function(deviceId) {
//   return [
//     Stays.find({deviceId: deviceId, active: true})
//   ];
// });

// if user doesn't have device info, publish when requested from registered device
Meteor.publish('device', function(deviceId) {
  if (deviceId) {
    var device = Devices.findOne(deviceId);
    if (device) {
      return [
        Devices.find(deviceId),
        Hotels.find(device.hotelId),
        HotelServices.find({
          hotelId: device.hotelId,
          active: true
        })
      ];
    }
  }
});

Meteor.publish('deviceByStayId', function(stayId) {
  var stay = Stays.findOne(stayId);

  if (stay) {
    if (stay.deviceId) {
      var device = Devices.findOne(stay.deviceId);
      if (device) {
        return [
          Devices.find(stay.deviceId),
          Hotels.find(device.hotelId),
          HotelServices.find({
            hotelId: device.hotelId,
            active: true
          })
        ];
      }
    }
  }

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
  }

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
