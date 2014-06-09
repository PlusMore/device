GoogleMaps.init(
  {
    'sensor': true, //optional
    'key': '', //optional
    'language': 'en' //optional
  }, function () {
    Session.set('gmloaded', true);
  }
);