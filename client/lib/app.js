Meteor.startup(function() { 
  App = {};
  var isUserAgentBlacklisted = function() {
    var blacklist = ['PhantomJS', 'Googlebot', 'Bing', 'Yahoo'];

    var userAgent = navigator.userAgent;

    if (!userAgent)
      return false;

    for (var i = 0; i < blacklist.length; i++) {
      if (~userAgent.indexOf(blacklist[i]))
        return true;
    }

    return false;
  };

  _.extend(App, {
  	identify: function() {
      Deps.autorun(function() { 
        var user = Meteor.user(),
            peopleProperties = {};

        if (user) {
          mixpanel.identify(user._id);
          console.log('User Identified', user._id);

          if (user && user.deviceId) {
            var deviceId = user.deviceId,
                device = Devices.findOne(deviceId);

            if (device) {
              var hotel = Hotels.findOne(device.hotelId);

              if (hotel) {
                peopleProperties = _.extend(peopleProperties, {
                  "Device": "{0} at {1}".format(device.location, hotel.name),
                  "Device Id": user.deviceId,
                  "Device Location": device.location,
                  "Hotel Name": hotel.name
                });  

                mixpanel.people.set(peopleProperties);  
                console.log('People properties set.');
              }
            }  
          }

          
        }   
      });   
    },
    track: function(key, properties) {
      properties = properties || {};

      if (isUserAgentBlacklisted()) {
        return;
      }

      Deps.nonreactive(function() {
        var user = Meteor.user();
        var emailProperties = {};
        var hotel;

        if (user && user.emails && user.emails.length > 0) {
          emailProperties['$email'] = user.emails[0].address;
        } else {
          emailProperties['$email']  = 'anonymous';            
        }
        _.extend(properties, emailProperties);

        var profileInfo = {};
        if (user && user.profile) {
          
          if (user.profile.name) {
            profileInfo['$name'] = user.profile.name;
          }
          if (user.profile.firstName) {
            profileInfo['$first_name'] = user.profile.firstName;
          }
          if (user.profile.lastName) {
            profileInfo['$last_name'] = user.profile.lastName;
          }
        } 

        if (user && user.deviceId) {
          var deviceId = user.deviceId,
              device = Devices.findOne(deviceId);

          hotel = Hotels.findOne(device.hotelId);

          _.extend(properties, {
            "Device Id": user.deviceId,
            "Device Location": device.location,
            "Hotel Name": hotel.name
          });

          if (typeof profileInfo['$name'] === 'undefined') {
            profileInfo['$name'] = device.location;
          }
        }
        _.extend(properties, profileInfo);

        _.extend(properties, {
          "Path": IronLocation.path()
        });

        if (hotel && hotel.trackAnalytics) {
          mixpanel.track(key, properties);
          console.log('Tracked metric: ', key, properties);
        } else {
          console.log('Not Tracked for this hotel', key, properties);
        }
      });
    },
    go: function() {
      // var stay = Stays.findOne({userId: Meteor.userId()});

      // if (!stay) {
      //   Router.go('enterCheckoutDate');
      // } else {
      //   App.goToStartPage();
      // }
      App.goToStartPage();
    },
    goToStartPage: function() {
      // var diningCategory = Categories.findOne({name: 'Dining'});
      // if (diningCategory) {
      //   Router.go('experiences', {categoryId: diningCategory._id});  
      // } else {
      //   var firstCategory = Categories.findOne();
      //   Router.go('experiences', {categoryId: firstCategory._id});
      // }
      Menu.show();
    }
  });

  App.helpers = {
  };

  _.each(App.helpers, function (helper, key) {
    Handlebars.registerHelper(key, helper);
  });


  Deps.autorun(function() {
    var user = Meteor.user();

    Meteor.setTimeout(function() {
      App.identify();
    }, 0);
  }); 

  // Deps.autorun(function() {
  //   var currentRoute = Router.current();
  //   if (currentRoute) {
  //     App.track("Page View", {
  //       "Path": currentRoute.path,
  //       "Name": currentRoute.route.name
  //     });
  //   }
  // })
});