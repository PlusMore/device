getRouteNames = function() {
  return _.filter(Object.keys(Router.routes), function(key) {
    return isNaN(parseInt(key, 10)) && key !== '_byPath';
  });
};
