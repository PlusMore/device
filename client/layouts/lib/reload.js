Meteor.startup(function() {
  Reload._onMigrate('app', function(retry) {
    Session.set('loader', 'Updating Software');
    return [true];
  });
});
