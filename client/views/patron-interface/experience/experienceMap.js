var initializeMap = function() {
  var mapOptions = {
    zoom: 14
  };
  var geo = Session.get('currentExperienceGeo');
  var experienceLatLng = new google.maps.LatLng( geo.latitude, geo.longitude );

  if (typeof experienceMap !== 'undefined') {
    experienceMap.unbindAll();
    experienceMap.setCenter(experienceLatLng);
    experienceMap.constructor(document.getElementById("experience-map"), mapOptions);
  } else {
    experienceMap =  new google.maps.Map(document.getElementById("experience-map"), mapOptions);
    experienceMap.setCenter(experienceLatLng); 
  }

  var marker = new google.maps.Marker({
    position: experienceLatLng,
    map: experienceMap
  });
}

Template.experienceMap.rendered = function () {
  if (this.data.geo) {
    // A but hacky, but using the session to survive HCR
    Session.set('currentExperienceGeo', this.data.geo);
    // intializeMapWhenReady();

    GoogleMaps.init({
      'sensor': true, //optional
      'key': '', //optional
      'language': 'en' //optional
    }, initializeMap);  
  }
};