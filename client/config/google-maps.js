Meteor.startup(function() {
  GoogleMaps.init(
    {
      'sensor': true, //optional
      'key': '', //optional
      'language': 'en' //optional
    }
  );  
});
