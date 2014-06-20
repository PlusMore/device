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
      
      // Add REST resource to base URL
      var url = yelp_base_url + 'search';

      var oauthBinding = getYelpOauthBinding(url);
      
      var parameters = {
        oauth_token: oauthBinding._config.accessToken
      };

      
      // Build up query
      // Search term or categories query
      if(isCategory)
        parameters.category_filter = search;
      else
        parameters.term = search;

      // Set lat, lon location, if available or default location
      if(longitude && latitude)
        parameters.ll = latitude + ',' + longitude;
      else
        parameters.location = 'New+York';

      // Results limited to 5
      parameters.limit = 5;

      // Once all the parameters are set, build the request headers.
      var headers = oauthBinding._buildHeader(parameters);

      // And send away, I'm just returning .data as that is the only
      // information relevant to the application.
      return oauthBinding._call('GET', url, headers, parameters).data;
    },
    yelpBusiness: function(id) {
      this.unblock();
      console.log('Yelp business for userId: ' + this.userId + '(id, lat, lon) with vals (', id, ')');
      var url = yelp_base_url + 'business/' + id;
      // Query OAUTH credentials (these are set manually)
      var oauthBinding = getYelpOauthBinding(url);

      var parameters = {
        oauth_token: oauthBinding._config.accessToken
      };

      var headers = oauthBinding._buildHeader(parameters);

      return oauthBinding._call('GET', url, headers, parameters).data;
    }
  });
}