InAppBrowser = {};

var verifyUrl = function(url) {
  return url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
};

InAppBrowser.navigate = function(url) {
  check(url, String);
  if (typeof url === 'string' && verifyUrl(url)) {
    Session.set('browser', url);
  }

  return false;
};

Meteor.startup(function() {
  window.alias_open = window.open;
  window.open = function(url, name, specs, replace) {
    // Do nothing, or do something smart... 
    console.log('hey... ');
  };
  $(document).on('click', 'a[target=in-app-browser]', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var url = $(e.currentTarget).attr('href');
    InAppBrowser.navigate(url);
    return false;
  });
});


Template.browser.helpers({
  isVisibleClass: function() {
    var animateOut = "fadeOutDownBig",
      animateIn = "fadeInUpBig";

    var url = Session.get('browser');

    if (typeof url === 'string' && verifyUrl(url)) {
      if (Session.get('hideBrowser')) {
        return animateOut;
      }
      return animateIn;
    } else {
      return animateOut + " hidden";
    }
  },
  url: function() {
    var url = Session.get('browser');
    if (typeof url === 'string' && verifyUrl(url)) {
      return Session.get('browser');
    }

    return undefined;
  }
});

var handleBack = function(e, tmpl) {
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
