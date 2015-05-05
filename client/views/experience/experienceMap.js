Template.experienceMap.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      var experience = Experiences.findOne(Session.get('currentExperienceId'));
      if(experience) {
        var experienceLatLng = new google.maps.LatLng(experience.geo.latitude, experience.geo.longitude);
        return {
          zoom: 18,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: true,
          center: experienceLatLng,
          scrollwheel: false
        }
      }
    }
  }
});

Template.experienceMap.onCreated(function() {
  GoogleMaps.ready('experienceMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance,
      icon: '/markers/restaurant.png'
    });
  });
});
