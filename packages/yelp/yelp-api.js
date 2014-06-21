YelpAPI = {
  search: function(search, isCategory, latitude, longitude, callback) {
    Meteor.call('searchYelp', search, isCategory, latitude, longitude, callback);
  },
  business: function(id, longitude, latitude, callback) {
    Meteor.call('yelpBusiness', id, latitude, longitude, callback);
  }
};