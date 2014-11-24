/* ---------------------------------------------------- +/

## Publications ##

All publications-related code.

/+ ---------------------------------------------------- */

// Used to get list of available hotels to register a device
// Admin returns all, hotel-staff returns the user's hotel
Meteor.publish('userHotelData', function () {
  var userId = this.userId;

  if (userId) {

    // if admin, publish all hotels
    // if hotel staff, only publish that hotel
    if (Roles.userIsInRole(userId, 'admin')) {
      return Hotels.find();
    } else if (Roles.userIsInRole(userId, 'hotel-staff')) {
      var fields = {hotelId:1},
      user = Meteor.users.findOne({_id:userId}),
      hotelId = user && user.hotelId || null;
      if (hotelId) {
        return [
          Meteor.users.find({_id: userId}, {fields: fields}),
          Hotels.find({_id: hotelId})
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
Meteor.publish(null, function () {
  var userId = this.userId;
  
  if (userId) {
    var fields = {
        stayId:1
      },
      user = Meteor.users.findOne({_id:userId}),
      stayId = user && user.stayId || null;


    if (stayId) {

      var stay = Stays.find(stayId);

      if (stay) {
        return [
          Meteor.users.find(userId, {fields: fields}),
          Stays.find(stayId)
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

// if user doesn't have device info, publish when requested from registered device
Meteor.publish('device', function(deviceId) {
  if (deviceId) {
    var device = Devices.findOne(deviceId);
    if (device) {
      return [
        Devices.find(deviceId),
        Hotels.find(device.hotelId),
        HotelServices.find({hotelId: device.hotelId, active: true})
      ];
    }
  }
});

Meteor.publish('experiencesData', function(deviceId) {
  var userId = this.userId,
      user = Meteor.users.findOne(userId);

  if (user || deviceId) {
    deviceId = deviceId || user.deviceId;
    var device = Devices.findOne(deviceId);

    if (device) {
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
        yelpId: 1
      }   

      var tagGroups = Meteor.tags.find( {group: {$exists: true} });
      var tagGroupsArray = [];
      tagGroups.forEach(function(tag) {
        if (tag.group && tagGroupsArray.indexOf(tag.group) === -1) {
          tagGroupsArray.push(tag.group);
        }
      });

      _.each(tagGroupsArray, function(tagGroup) {
        if (tagGroup !== 'filterGroup') {
          experiencePublishFields[tagGroup+'Tags'] = 1;
        }
      });

      return [
        Categories.find({active: true}),
        Experiences.find({active: true}, {fields: experiencePublishFields})
      ];
    }
  } else {
    this.ready();
    return null;
  }
});

Meteor.publish('stayInfo', function(stayId) {
  return [
    Stays.find(stayId),
    Meteor.users.find({stayId: stayId})
  ];
});

Meteor.publish('experience', function(experienceId) {
  return Experiences.find(experienceId);
});

Meteor.publish('orders', function() {
  return [
    Orders.find({userId: this.userId})
  ];
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

Meteor.publish('cart', function(cartId) {
  return CartItems.find({cartId: cartId});
});
// Meteor.publish('experience', function(id) {
//   return [
//     Experiences.find(id)
//   ];
// });