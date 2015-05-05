Template.hotelInformationMap.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      // get hotel coords
      if (typeof Session.get('hotelGeo') !== 'undefined') {
        var geo = Session.get('hotelGeo');
        var hotelLatLng = new google.maps.LatLng(geo.latitude, geo.longitude);
      } else {
        var hotel = Hotels.findOne();
        var hotelLatLng = new google.maps.LatLng(hotel.geo.latitude, hotel.geo.longitude);
        Session.set('hotelGeo', hotel.geo);
      }
      return {
        zoom: 18,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: true,
        center: hotelLatLng,
        scrollwheel: false
      }
    }
  }
});

Template.hotelInformationMap.onCreated(function() {
  GoogleMaps.ready('hotelMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance,
      icon: '/markers/hotel.png'
    });
  });
});
