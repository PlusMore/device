Template.hotelServices.helpers({
  subscriptionsReady: function() {
    if (subscriptions && (subscriptions.stayInfo  && typeof subscriptions.stayInfo !== 'undefined') && (subscriptions.deviceData && typeof subscriptions.deviceData !== 'undefined')) {
      return subscriptions.stayInfo.ready() && subscriptions.deviceData.ready();
    }
  },
  subNavContentTemplate: function () {
    return Session.get('selectedService');
  },
  hotelServicesEnabled: function () {
    var hotelCursor = Hotels.find();
    
    if (hotelCursor.count() > 0) {
      var hotel = Hotels.findOne();
      if (!hotel.hotelServicesEnabled) {
        return false;
      } else {
        var activeHotelServices = HotelServices.find({hotelId: hotel._id, active: true});

        if (activeHotelServices.count() > 0) {
          return true;
        }
      }
    }
  }
});