Meteor.startup(function() {
  // set zone
  var now = moment();
  var zone = now.zone();

  Session.set('zone', zone);
});
