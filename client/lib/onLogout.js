
// Redirect to / when no user
// TODO: When resetting, use Session variable to show resetting

// Meteor.startup(function() {
//   Deps.autorun(function() {
//     var user = Meteor.user();
//     var currentRoute = Router.current();

//     if (! user && currentRoute) {

//       if (! Meteor.loggingIn()) {
//         if (Router.current().route.name !== 'welcome') {
//           console.log('redirect')
//           Router.go('welcome');
//         }
//       }
      
//     }
    
//   });
// });

