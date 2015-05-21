Meteor.startup(function() {

  BrowserPolicy.content.disallowInlineScripts();
  // TODO: Damn it, Google.
  BrowserPolicy.content.allowEval();

  var trustedSecure = [
    'fontastic.s3.amazonaws.com',
    '*.filepicker.io',
    '*.googleapis.com',
    '*.gstatic.com',
    '*.cloudfront.net',
    '*.plusmoretablets.com',
    '*.plusmore.io',
    '*.yelp.com',
    '*.kadira.io'
  ];

  var trustedBoth = [
    '*.mxpnl.com',
    '*.yelpcdn.com'
  ];

  _.each(trustedSecure, function(trustedDomain) {
    allowDomainAsOrigin(trustedDomain, false);
  });

  _.each(trustedBoth, function(trustedDomain) {
    allowDomainAsOrigin(trustedDomain, true);
  });

});

var allowDomainAsOrigin = function(domain, allowHttp) {
  if (allowHttp) {
    var origin = "http://" + domain; // this should only be allowed when over http, don't know how to do that though
    BrowserPolicy.content.allowOriginForAll(origin);
    var wsOrigin = "ws://" + domain;
    BrowserPolicy.content.allowOriginForAll(wsOrigin);
  }

  var secureOrigin = "https://" + domain;
  BrowserPolicy.content.allowOriginForAll(secureOrigin);

  var wssOrigin = "ws://" + domain;
  BrowserPolicy.content.allowOriginForAll(wssOrigin);
};


