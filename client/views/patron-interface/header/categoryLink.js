Template.categoryLink.helpers({
  activeRouteClass: function(/* route names */) {
    
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var experienceCategory = this.name ? this.name : null;

    var active = _.any(args, function(name) {
      var currentPath, pathForName, _ref, _ref1;

      if (experienceCategory) {
        var activeCategory = Session.get('activeCategory') || ""
        return experienceCategory.toLowerCase() === activeCategory.toLowerCase();
      } else {
        currentPath = (_ref = (_ref1 = Router.current()) != null ? _ref1.path : void 0) != null ? _ref : location.pathname;
        categoryURI = encodeURIComponent(name);

        return currentPath.indexOf(categoryURI) > -1;
      }

      
    });
    return active && 'active' || '';
  },
  categoryLink: function() {
    return Router.routes['experiences'].path({category: this.name});
  }
});