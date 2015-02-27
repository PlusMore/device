(function () {

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/accounts-plusmore-device/server.js                                     //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
Accounts.registerLoginHandler(function (options) {                                 // 1
  if (!options.device)                                                             // 2
    return undefined; // don't handle                                              // 3
                                                                                   // 4
  check(options, {                                                                 // 5
    device: Boolean,                                                               // 6
    deviceId: String                                                               // 7
  });                                                                              // 8
                                                                                   // 9
  // make sure there's a valid device                                              // 10
  var device = Devices.findOne(options.deviceId);                                  // 11
  if (!device)                                                                     // 12
    throw new Meteor.error(403, "Device not found");                               // 13
                                                                                   // 14
  var meteorUserId = Meteor.users.insert({                                         // 15
    deviceId: options.deviceId,                                                    // 16
    roles: ['device']                                                              // 17
  });                                                                              // 18
                                                                                   // 19
  return {userId: meteorUserId};                                                   // 20
});                                                                                // 21
                                                                                   // 22
Accounts.registerLoginHandler(function (options) {                                 // 23
  if (!options.stay)                                                               // 24
    return undefined; // don't handle                                              // 25
                                                                                   // 26
  check(options, {                                                                 // 27
    device: Boolean,                                                               // 28
    deviceId: String                                                               // 29
  });                                                                              // 30
                                                                                   // 31
  // make sure there's a valid device                                              // 32
  var device = Devices.findOne(options.deviceId);                                  // 33
  if (!device)                                                                     // 34
    throw new Meteor.error(403, "Device not found");                               // 35
                                                                                   // 36
  var meteorUserId = Meteor.users.insert({                                         // 37
    deviceId: options.deviceId,                                                    // 38
    roles: ['device']                                                              // 39
  });                                                                              // 40
                                                                                   // 41
  return {userId: meteorUserId};                                                   // 42
});                                                                                // 43
                                                                                   // 44
Accounts.registerLoginHandler(function (options) {                                 // 45
  if (!options.pin)                                                                // 46
    return undefined; // don't handle                                              // 47
                                                                                   // 48
  check(options, {                                                                 // 49
    userId: String,                                                                // 50
    pin: String                                                                    // 51
  });                                                                              // 52
                                                                                   // 53
  // make sure there's a valid user                                                // 54
  var user = Meteor.users().findOne(loginRequest.userId);                          // 55
  if (!user) {                                                                     // 56
    throw new Meteor.Error(500, 'User not found.');                                // 57
  }                                                                                // 58
                                                                                   // 59
  Meteor.users.update(userId, loginAttempts++);                                    // 60
  if (user.loginAttempts >= 5) {                                                   // 61
    throw new Meteor.Error(500, 'Too many incorrect attempts. Account Blocked.');; // 62
  }                                                                                // 63
                                                                                   // 64
  // make this more secure - hash the pin - look at accounts password              // 65
  if (user.pin !== options.pin) {                                                  // 66
    throw new Meteor.Error(500, 'Invalid Pin');                                    // 67
  }                                                                                // 68
                                                                                   // 69
  return {userId: user._id};                                                       // 70
});                                                                                // 71
                                                                                   // 72
                                                                                   // 73
                                                                                   // 74
Accounts.addAutopublishFields({                                                    // 75
  forLoggedInUser: ['deviceId'],                                                   // 76
  forOtherUsers: ['deviceId']                                                      // 77
});                                                                                // 78
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);
