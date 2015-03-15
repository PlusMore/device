Template.navLinkUI.helpers({
  displayNavLink: function() {
    return Nav.checkPermissions(this);
  },
  path: function() {
    return Router.routes[routeName].path(routeData || {});
  }
});

var handleNav = function(e, tmpl) {
  e.preventDefault();
  e.stopImmediatePropagation();
  console.log(e.type);
  var href = $(e.currentTarget).attr('href');
  if (Iron.Location.get().path === href) {
    Menu.hide();
  } else {
    Menu.hide();
    Router.go(href);
  }
};

var events = {};
events[clickevent + " a"] = handleNav;

Template.navLinkUI.events(events);
