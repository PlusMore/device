Meteor.loginDevice = function(deviceId, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
  var loginRequest = {device: true, deviceId: deviceId};

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};