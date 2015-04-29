// TODO: make meteor package out of yelp integration

YelpAPI = {
  search: function(search, isCategory, latitude, longitude, callback) {
    Meteor.call('searchYelp', search, isCategory, latitude, longitude, callback);
  },
  business: function(id, callback) {
    Meteor.call('yelpBusiness', id, callback);
  }
};
