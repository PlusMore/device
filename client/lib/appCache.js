Meteor.startup(function() {
  if (window.applicationCache) {
    window.applicationCache.onerror = function() {
      var confirmReload = confirm('The application encountered an error while updating. Please press OK to reload.');
      if (confirmReload) {
        document.location = document.location;
      }
    };
  }
});
