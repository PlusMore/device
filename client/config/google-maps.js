Meteor.startup(function() {
  GoogleMaps.load({
    'sensor': false, //optional
    'key': Meteor.settings.public.googlemaps, //optional
    'language': 'en' //optional
  });
});
