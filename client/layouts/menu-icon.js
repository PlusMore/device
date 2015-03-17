Meteor.startup(function() {
  $(document).on(clickevent, '.icon-menu', function(e) {
    e.preventDefault();

    if (!Menu.isOpen()) {
      e.stopImmediatePropagation();
      Menu.show();
    }
  });
});
