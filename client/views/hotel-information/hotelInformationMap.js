var retry = 0;
var initializeMap = function () {
	if (typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.Map !== 'undefined') {
		var mapOptions = {
			zoom: 18,
			disableDefaultUI: true,
			zoomControl: true
		};
		var hotel = Hotels.findOne();
		var hotelLatLng = new google.maps.LatLng ( hotel.geo.latitude, hotel.geo.longitude );

		hotelMap = new google.maps.Map(document.getElementById("hotel-map"), mapOptions);
		hotelMap.setCenter(hotelLatLng);

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
		'sensor': false,
		'key': Meteor.settings.public.googlemaps,
		'language': 'en'
	}, initializeMap);
};