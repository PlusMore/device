Meteor.startup(function() {
  GoogleMaps.init(
    {
      'sensor': false, //optional
      'key': Meteor.settings.public.googlemaps, //optional
      'language': 'en' //optional
    }
  );  
});
