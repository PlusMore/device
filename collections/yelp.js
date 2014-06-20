// this package requires yelp service to be configured


var yelp_base_url = "http://api.yelp.com/v2/";

YelpAPI = {
  search: function(search, isCategory, latitude, longitude) {
    Meteor.call('searchYelp', search, isCategory, latitude, longitude, function(error, result) {
      if (error) Errors.throw(error);
      console.log(result);
    });
  },
  business: function(id, longitude, latitude) {
    Meteor.call('yelpBusiness', id, latitude, longitude, function(error, result) {
      if (error) Errors.throw(error);

      console.log(result);
    });
  }
};

if (Meteor.isServer) {
  var getYelpOauthBinding = function(url) {
    var config = Accounts.loginServiceConfiguration.findOne({service: 'yelp'});
    if (config) {
      config.secret = config.consumerSecret;
      var oauthBinding = new OAuth1Binding(config, url)
      oauthBinding.accessToken = config.accessToken;
      oauthBinding.accessTokenSecret = config.accessTokenSecret;

      return oauthBinding;
    } else {
      throw new Meteor.Error(500, 'Yelp Not Configured');
    }  
  }

  Meteor.methods({
    searchYelp: function(search, isCategory, latitude, longitude) {
      this.unblock();
      console.log('Yelp search for userId: ' + this.userId + '(search, isCategory, lat, lon) with vals (', search, isCategory, latitude, longitude, ')');
      var url = yelp_base_url + 'search';
      var oauthBinding = getYelpOauthBinding(url);
      
      // oauthBinding.accessToken = user.services.twitter.accessToken
      //   oauthBinding.accessTokenSecret = user.services.twitter.accessTokenSecret

      var parameters = {};

      // Search term or categories query
      if(isCategory)
        parameters.category_filter = search;
      else
        parameters.term = search;

      // Set lat, lon location, if available (SF is default location)
      if(longitude && latitude)
        parameters.ll = latitude + ',' + longitude;
      else
        parameters.location = 'New+York';

      // Results limited to 5
      parameters.limit = 5;

      parameters.oauth_token = oauthBinding._config.accessToken;

      var headers = oauthBinding._buildHeader(parameters);

      return oauthBinding._call('GET', url, headers, parameters);
    },
    yelpBusiness: function(id, latitude, longitude) {
      this.unblock();
      console.log('Yelp business for userId: ' + this.userId + '(id, lat, lon) with vals (', id, latitude, longitude, ')');
      var url = yelp_base_url + 'business/' + id;
      // Query OAUTH credentials (these are set manually)
      var oauthBinding = getYelpOauthBinding(url);

      var parameters = {};

      if(latitude && longitude)
        parameters.ll = latitude + ',' + longitude;

      parameters.oauth_token = oauthBinding._config.accessToken;
      
      var headers = oauthBinding._buildHeader(parameters);

      return oauthBinding._call('GET', url, headers, parameters);
    }
  });
}