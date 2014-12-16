var closeMenu = function() {
  Menu.hide();
  this.next();
}
Router.onRun(closeMenu);