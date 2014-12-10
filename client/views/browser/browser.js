InAppBrowser = {};

var verifyUrl = function(url) {
  return url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
}

InAppBrowser.navigate = function(url) {
  check(url, String);
  if (verifyUrl(url)) {
    Session.set('browser', url);
  }
}

Meteor.startup(function() {
  $(document).on(clickevent, 'a[target=in-app-browser]', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var url = $(e.currentTarget).attr('href');
    InAppBrowser.navigate(url);
  });
});


Template.browser.helpers({
  isVisibleClass: function() {
    var animateOut = "fadeOutDownBig",
        animateIn = "fadeInUpBig";
    if (!!Session.get('browser')) {
      if (Session.get('hideBrowser')) {
        return animateOut;
      }
      return animateIn;
    } else {
      return animateOut;
    }
  },
  url: function() {
    return Session.get('browser');
  }
});

var handleBack = function (e, tmpl) {
  e.preventDefault();
  Session.set('hideBrowser', true);
  Meteor.setTimeout(function() {
    Session.set('browser', undefined);
    Session.set('hideBrowser', false);
  }, 500);
};

var events = {};
events[clickevent + " a.back"] = handleBack;

Template.browser.events(events);