Meteor.startup(function() {
  Menu = {};
  _.extend(Menu, {
    show: function() {
      Session.set('animatingMenu', true);
      Session.set('modalview', true);
      Meteor.setTimeout(function() {
        Session.set('showMenu', true); // client/layouts/device/deviceLayout
        Meteor.setTimeout(function() {
          Session.set('animatingMenu', false);
        }, 400);
      }, 25);
    },
    hide: function() {
      Session.set('showMenu', false);
      Meteor.setTimeout(function() {
        Session.set('modalview', false);
      }, 400);
    },
    isOpen: function() {
      return !!Session.get('showMenu');
    }
  });
});
