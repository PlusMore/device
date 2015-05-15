HotelService = Cluster.discoverConnection('hotel');

if (Meteor.isClient) {
  HotelService.onReconnect = function() {
    console.log('reconnect')
    var loginToken = Meteor._localStorage.getItem('Meteor.loginToken');
    this.call('authenticate', loginToken);
  };

  Tracker.autorun(function() {
    Meteor.userId();
    HotelService.onReconnect();
  });
}
