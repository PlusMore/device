Meteor.loginDevice = function(deviceId, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
  var loginRequest = {device: true, deviceId: deviceId};

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};

Meteor.loginWithNameAndCheckoutDate = function(loginRequest, callback) {
  loginRequest = _.pick(loginRequest, ['firstName', 'lastName', 'checkoutDate']);
  check(loginRequest, {
    firstName: String,
    lastName: String,
    checkoutDate: Date
  });

  loginRequest = _.extend(loginRequest, {
    stay: true
  });

  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });

}

Meteor.loginWithPin = function(loginRequest, callback) {
  loginRequest = _.pick(loginRequest, ['userId', 'pin']);
  check(loginRequest, {
    userId: String,
    pin: String
  });

  loginRequest = _.extend(loginRequest, {
    pin: true
  });

  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
  
}