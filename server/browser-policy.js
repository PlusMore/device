Meteor.startup(function() {
  BrowserPolicy.content.allowEval();
  // CDN
  BrowserPolicy.content.allowOriginForAll("https://*.filepicker.io");
  BrowserPolicy.content.allowOriginForAll("http://*.filepicker.io");
  BrowserPolicy.content.allowOriginForAll("http://*.mxpnl.com");
  // Fonts & Icons
  BrowserPolicy.content.allowOriginForAll("https://*.gstatic.com");
  BrowserPolicy.content.allowOriginForAll("http://*.gstatic.com");
  BrowserPolicy.content.allowOriginForAll("https://*.googleapis.com");
  BrowserPolicy.content.allowOriginForAll("http://*.googleapis.com");
  BrowserPolicy.content.allowOriginForAll("https://*.google.com");
  BrowserPolicy.content.allowOriginForAll("http://*.google.com");
  BrowserPolicy.content.allowOriginForAll("https://fontastic.s3.amazonaws.com");
  BrowserPolicy.content.allowOriginForAll("http://fontastic.s3.amazonaws.com");
  BrowserPolicy.content.allowOriginForAll("https://*.cloudfront.net");
  // PlusMore Apps
  BrowserPolicy.content.allowOriginForAll("http://*.plusmoretablets.com");
  BrowserPolicy.content.allowOriginForAll("https://*.plusmoretablets.com");
  // misc
  BrowserPolicy.content.allowOriginForAll("https://*.yelp.com");
  BrowserPolicy.content.allowOriginForAll("http://*.yelp.com");
  BrowserPolicy.content.allowOriginForAll("https://*.kadira.io");
  BrowserPolicy.content.allowOriginForAll("http://*.kadira.io");
});
