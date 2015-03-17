var closeMenu = function() {
  Menu.hide();
  this.next();
};
Router.onBeforeAction(closeMenu);
