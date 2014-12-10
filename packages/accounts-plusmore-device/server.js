Accounts.registerLoginHandler(function (options) {
  if (!options.device)
    return undefined; // don't handle

  check(options, {
    device: Boolean,
    deviceId: String
  });

  // make sure there's a valid device
  var device = Devices.findOne(options.deviceId);
  if (!device)
    throw new Meteor.error(403, "Device not found");

  var meteorUserId = Meteor.users.insert({
    deviceId: options.deviceId,
    roles: ['device']
  });

  return {userId: meteorUserId};
});

Accounts.registerLoginHandler(function (options) {
  if (!options.stay)
    return undefined; // don't handle

  check(options, {
    device: Boolean,
    deviceId: String
  });

  // make sure there's a valid device
  var device = Devices.findOne(options.deviceId);
  if (!device)
    throw new Meteor.error(403, "Device not found");

  var meteorUserId = Meteor.users.insert({
    deviceId: options.deviceId,
    roles: ['device']
  });

  return {userId: meteorUserId};
});

Accounts.registerLoginHandler(function (options) {
  if (!options.pin)
    return undefined; // don't handle

  check(options, {
    userId: String,
    pin: String
  });

  // make sure there's a valid user
  var user = Meteor.users().findOne(loginRequest.userId);
  if (!user) {
    throw new Meteor.Error(500, 'User not found.');
  }
  
  Meteor.users.update(userId, loginAttempts++);
  if (user.loginAttempts >= 5) {
    throw new Meteor.Error(500, 'Too many incorrect attempts. Account Blocked.');;
  }

  // make this more secure - hash the pin - look at accounts password
  if (user.pin !== options.pin) {
    throw new Meteor.Error(500, 'Invalid Pin');
  }

  return {userId: user._id};
});

  

Accounts.addAutopublishFields({
  forLoggedInUser: ['deviceId'],
  forOtherUsers: ['deviceId']
});