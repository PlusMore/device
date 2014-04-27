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

Accounts.addAutopublishFields({
  forLoggedInUser: ['deviceId'],
  forOtherUsers: ['deviceId']
});