Meteor.startup(function () {
  Reload._onMigrate('app', function(retry) {
    console.log('migrating app');
    Session.set('loader', 'Updating Software');
    return [true];
  });
});