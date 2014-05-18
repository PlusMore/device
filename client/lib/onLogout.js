
// Redirect to / when no user
// TODO: When resetting, use Session variable to show resetting

Meteor.startup(function() {
  Deps.autorun(function() {
    var user = Meteor.user();
    var currentRoute = Router.current();

    if (! user && currentRoute) {
      console.log(Router.current())
      if (Router.current().route.name !== 'welcome') {
        Router.go('welcome');
      }
    }
    
  });
});

