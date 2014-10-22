Template.deviceLayout.helpers({
  connectionStatus: function () {
    return Meteor.status().status;
  },
  hotelPhotoUrl: function() {
    var hotelsCursor = Hotels.find();

    if (hotelsCursor.count() > 0) {
      var hotel = Hotels.findOne();
      if (hotel) {
        if (hotel.photoUrl) {
          return hotel.photoUrl + '/convert?w=1024&h=768&fit=scale&cache=true';
        }
      }
    } 
    
    return Meteor.settings.public.bgPhotoUrl + '/convert?w=1024&h=768&fit=scale&cache=true';
  },
  modalview: function() {
    return Session.get('modalview') ? 'modalview' : '';
  },
  showMenu: function() {
    return Session.get('showMenu') ? 'animate' : '';
  },
  loaderClass: function() {
    return Session.get('loader') ? 'animated fadeIn' : 'animated fadeOut not-visible';
  },
  loaderText: function() {
    return Session.get('loader');
  }
});

var handlePerspectiveContainerClick = function(e, tmpl) {
  e.preventDefault();
  e.stopImmediatePropagation();

  if (Session.get('animatingMenu')) {
    return;
  }

  if (App.isMenuOpen()) {
    App.hideMenu();
  }
};

var events = {};
events[clickevent + " .perspective.animate > .perspective-container"] = handlePerspectiveContainerClick;

Template.deviceLayout.events(events);

Template.deviceLayout.rendered = function () {
  Session.set('loader', undefined);
};