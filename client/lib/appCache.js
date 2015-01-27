Meteor.startup(function() {
  if (window.applicationCache) {
    window.applicationCache.onerror = function() {
      document.location = document.location;
    };
  }
});
