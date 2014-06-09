var intializeMapWhenReady = function() {
  var that = this;
  if (typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.Map !== 'undefined') {
    console.log('loaded');
    var mapOptions = {
      zoom: 8
    };
    var map = new google.maps.Map(document.getElementById("experience-map"), mapOptions); 
    map.setCenter(new google.maps.LatLng( 35.363556, 138.730438 ));
  } else {
    console.log('not loaded');
    Meteor.setTimeout(arguments.callee);
  }
  
}

Template.experienceMap.rendered = function () {
  intializeMapWhenReady();
};

