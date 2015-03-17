Meteor.startup(function() {
  $(document).on('click', '[data-dismiss=modal]', function() {
    Session.set('modalOpen', false);
  });
});
