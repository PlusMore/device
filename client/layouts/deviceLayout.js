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
  showMenu: function() {
    return Session.get('showMenu') ? 'animate' : '';
  }
});

Template.deviceLayout.events({
  'click .perspective.animate > .container': function (e) {
    e.preventDefault();
    Session.set('showMenu', false);
  }
});