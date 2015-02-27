(function () {

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/accounts-plusmore-device/client.js                                           //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
Meteor.loginDevice = function(deviceId, callback) {                                      // 1
  //create a login request with admin: true, so our loginHandler can handle this request // 2
  var loginRequest = {device: true, deviceId: deviceId};                                 // 3
                                                                                         // 4
  //send the login request                                                               // 5
  Accounts.callLoginMethod({                                                             // 6
    methodArguments: [loginRequest],                                                     // 7
    userCallback: callback                                                               // 8
  });                                                                                    // 9
};                                                                                       // 10
                                                                                         // 11
Meteor.loginWithNameAndCheckoutDate = function(loginRequest, callback) {                 // 12
  loginRequest = _.pick(loginRequest, ['firstName', 'lastName', 'checkoutDate']);        // 13
  check(loginRequest, {                                                                  // 14
    firstName: String,                                                                   // 15
    lastName: String,                                                                    // 16
    checkoutDate: Date                                                                   // 17
  });                                                                                    // 18
                                                                                         // 19
  loginRequest = _.extend(loginRequest, {                                                // 20
    stay: true                                                                           // 21
  });                                                                                    // 22
                                                                                         // 23
  Accounts.callLoginMethod({                                                             // 24
    methodArguments: [loginRequest],                                                     // 25
    userCallback: callback                                                               // 26
  });                                                                                    // 27
                                                                                         // 28
}                                                                                        // 29
                                                                                         // 30
Meteor.loginWithPin = function(loginRequest, callback) {                                 // 31
  loginRequest = _.pick(loginRequest, ['userId', 'pin']);                                // 32
  check(loginRequest, {                                                                  // 33
    userId: String,                                                                      // 34
    pin: String                                                                          // 35
  });                                                                                    // 36
                                                                                         // 37
  loginRequest = _.extend(loginRequest, {                                                // 38
    pin: true                                                                            // 39
  });                                                                                    // 40
                                                                                         // 41
  Accounts.callLoginMethod({                                                             // 42
    methodArguments: [loginRequest],                                                     // 43
    userCallback: callback                                                               // 44
  });                                                                                    // 45
                                                                                         // 46
}                                                                                        // 47
///////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
