Template.navLinkUI.helpers({
  path: function () {
    return Router.routes[routeName].path(routeData || {});
  }
});