// this package requires yelp service to be configured


var yelp_base_url = "http://api.yelp.com/v2/";

YelpAPI = {
  search: function(search, isCategory, latitude, longitude) {
    Meteor.call('searchYelp', search, isCategory, latitude, longitude, function(error, result) {
      if (error) Errors.throw(error);
      debugger;
      console.log(result);
    });
  },
  business: function(id, longitude, latitude) {
    Meteor.call('yelpBusiness', id, latitude, longitude);
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

    debugger;
    
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
    console.log('Yelp business for userId: ' + this.userId + '(id, lat, lon) with vals (', id, latitude, longitude, ')');
    this.unblock();
    // Query OAUTH credentials (these are set manually)
    var auth = Accounts.loginServiceConfiguration.findOne({service: 'yelp'});

    // Add auth signature manually
    auth['serviceProvider'] = { signatureMethod: "HMAC-SHA1" };

    var accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
    },
    parameters = {};

    // Search term or categories query
    if(isCategory)
      parameters.category_filter = search;
    else
      parameters.term = search;

    // Set lat, lon location, if available (SF is default location)
    if(latitude && longitude)
      parameters.ll = latitude + ',' + longitude;
    else
      parameters.location = 'New+York+NY';

    // Results limited to 5
    parameters.limit = 5;

    // Configure OAUTH parameters for REST call
    parameters.oauth_consumer_key = auth.consumerKey;
    parameters.oauth_consumer_secret = auth.consumerSecret;
    parameters.oauth_token = auth.accessToken;
    parameters.oauth_signature_method = auth.serviceProvider.signatureMethod;
    var url = yelp_base_url + 'business/' + id;
    // Create OAUTH1 headers to make request to Yelp API
    var oauthBinding = new OAuth1Binding(auth.consumerKey, auth.consumerSecret, url);
    oauthBinding.accessTokenSecret = auth.accessTokenSecret;
    var headers = oauthBinding._buildHeader();

    

    // Return data results only
    return oauthBinding._call('GET', url, headers, parameters);
  }
});
}