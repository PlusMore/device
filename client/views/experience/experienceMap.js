var retry = 0;
var initializeMap = function() {
  if (typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.Map !== 'undefined') {
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
      map: experienceMap,
      icon: '/markers/restaurant.png'
    });

    var hotel = Hotels.findOne();
    if (hotel) {
      var hotelLatLng = new google.maps.LatLng(hotel.geo.latitude, hotel.geo.longitude);
      var marker = new google.maps.Marker({
        position: hotelLatLng,
        map: experienceMap,
        icon: '/markers/hotel.png'
      });
    }
  } else if (retry < 5) {
    Meteor.setTimeout(arguments.callee, 100);
    retry++;
  }
};

Template.experienceMap.rendered = function () {
  if (this.data.geo) {
    // A but hacky, but using the session to survive HCR
    Session.set('currentExperienceGeo', this.data.geo);
    // intializeMapWhenReady();

    GoogleMaps.init({
      'sensor': false, //optional
      'key': Meteor.settings.public.googlemaps, //optional
      'language': 'en' //optional
    }, initializeMap);  
  }
};