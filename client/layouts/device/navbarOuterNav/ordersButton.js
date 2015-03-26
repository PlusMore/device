var handleNav = function(e, tmpl) {
  e.preventDefault();
  e.stopImmediatePropagation();
  console.log(e.type);
  var href = $(e.currentTarget).attr('href');
  if (Iron.Location.get().path === href) {
    Menu.hide();
  } else {
    Router.go(href);
  }
};

var events = {};
events[clickevent + " a"] = handleNav;

Template.ordersButton.events(events);
