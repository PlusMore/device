App = {};
var isUserAgentBlacklisted = function() {
  var blacklist = ['PhantomJS', 'Googlebot', 'Bing', 'Yahoo'];

  var userAgent = navigator.userAgent;

  if (!userAgent)
    return false;

  for (var i = 0; i < blacklist.length; i++) {
    if (~userAgent.indexOf(blacklist[i]))
      return true;
  }

  return false;
}

_.extend(App, {
	track: function(key, meta) {
    meta = meta || {};

    if (isUserAgentBlacklisted()) {
      return;
    }

    Deps.autorun(function(c) {
      if (!Meteor.loggingIn()) {
        var user = Deps.nonreactive(function() { return Meteor.user(); });
        var email;

        if (user && user.emails && user.emails.length > 0) {
          email = user.emails[0].address;
        } else {
          email = 'anonymous';
        }

        if (user && user.deviceId) {
          _.extend(meta, {
            deviceId: user.deviceId
          });
        }

        _.extend(meta, {
          email: email,
          path: location.pathName
        });

        mixpanel.track(key, meta);
        c.stop();
      }  
    });
  }
});

App.helpers = {
};

_.each(App.helpers, function (helper, key) {
  Handlebars.registerHelper(key, helper);
});

Meteor.startup(function() {
  Deps.autorun(function () {
    var path = IronLocation.path();
    App.track('Page Views')
  }); 
});
