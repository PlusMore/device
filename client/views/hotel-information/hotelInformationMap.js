var retry = 0;
var initializeMap = function () {
  if (typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.Map !== 'undefined') {
    var mapOptions = {
      zoom: 18,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: true,
      // mapTypeId: 'hybrid'
    };
    
    if (typeof Session.get('hotelGeo') !== 'undefined'){
      var geo = Session.get('hotelGeo');
      var hotelLatLng = new google.maps.LatLng( geo.latitude, geo.longitude );
    } else {
      var hotel = Hotels.findOne();
      var hotelLatLng = new google.maps.LatLng( hotel.geo.latitude, hotel.geo.longitude );
      Session.set('hotelGeo', hotel.geo);
    }

    if (typeof hotelMap !== 'undefined') {
        hotelMap.unbindAll();
        hotelMap.setCenter(hotelLatLng);
        hotelMap.constructor(document.getElementById("hotel-map"), mapOptions);
    } else {
      hotelMap = new google.maps.Map(document.getElementById("hotel-map"), mapOptions);
      hotelMap.setCenter(hotelLatLng);
    }

    var marker = new google.maps.Marker({
      position: hotelLatLng,
      map: hotelMap,
      icon: '/markers/hotel.png'
    });
  } else if (retry < 5) {
    Meteor.setTimeout(arguments.callee, 100);
    retry++;
  }
};

Template.hotelInformationMap.rendered = function () {
  GoogleMaps.init({
    'sensor': false, //optional
      'key': Meteor.settings.public.googlemaps, //optional
      'language': 'en' //optional
  }, initializeMap);
};