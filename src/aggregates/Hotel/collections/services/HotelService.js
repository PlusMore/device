// 'authenticate' expects the calling service to implement 'getUserByToken'
// /device/src/aggregates/Accounts/methods/getUserByToken.js

// PlusMore.Services.HotelService = Cluster.discoverConnection('hotel');
PlusMore.Services.HotelService = Meteor.connection;


// if (Meteor.isClient) {
//   PlusMore.Services.HotelService.onReconnect = function() {
//     console.log('reconnect')
//     var loginToken = Meteor._localStorage.getItem('Meteor.loginToken');
//     this.call('authenticate', loginToken);
//   };

//   Tracker.autorun(function() {
//     Meteor.userId();
//     PlusMore.Services.HotelService.onReconnect();
//   });
// }


