var intializeMapWhenReady = function() {
  if (typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.Map !== 'undefined') {
    console.log('loaded');
    var mapOptions = {
      zoom: 14
    };
    var geo = Session.get('currentExperienceGeo');

    var map = new google.maps.Map(document.getElementById("experience-map"), mapOptions); 

    var experienceLatLng = new google.maps.LatLng( geo.latitude, geo.longitude )
    map.setCenter(experienceLatLng);

    var marker = new google.maps.Marker({
      position: experienceLatLng,
      map: map
    });
  } else {
    console.log('not loaded');
    Meteor.setTimeout(arguments.callee, 100);
  }
  
}

Template.experienceMap.rendered = function () {
  if (this.data.geo) {
    // A but hacky, but using the session to survive HCR
    Session.set('currentExperienceGeo', this.data.geo);
    intializeMapWhenReady();
  }
};

