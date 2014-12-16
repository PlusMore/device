var subs = new SubsManager();

// Config

Router.configure({
  layoutTemplate: 'deviceLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

// Filters

var filters = {
  clearCurrentExperienceId: function() {
    Session.set('currentExperienceId', undefined);
    this.next();
  },
  scroll: function() {
    Meteor.setTimeout(function(){
      $('.main').animate({scrollTop: 0}, 400);
    });   
    this.next();
  },
  clearErrors: function() {
    Errors.clearSeen();
    this.next();
  }
};


// /client/layouts/router.js also adds an onRun hook to close the menu
if (Meteor.isClient) {
  Router.onBeforeAction(filters.clearErrors);
  Router.onRun(filters.clearCurrentExperienceId);
  Router.onRun(filters.scroll);
}

// Routes

Router.route('/', function() {
  this.render('welcome');
}, {
  name: 'welcome'
});

Router.route('/setup-device', function() {
  this.render('setupDevice');
}, {
  name: 'setupDevice',
  waitOn: function() {
    return subs.subscribe('userHotelData');
  }
});

Router.route('/orders', function() {
  this.render('orders');
}, {
  name: 'orders',
  waitOn: function() {
    return subs.subscribe('orders');
  }
});

// see subscriptions triggered in main.js
Router.route('/hotel-services', function() {
  this.render('hotelServices', {
    data: function () {
      var selectedService = Session.get('selectedService');
      return {
        configuration: HotelServices.findOne({type: selectedService})
      };
    }
  });
}, {
  name: 'hotelServices',
  onRun: function() {
    var first = HotelServices.findOne({type: {$not: 'roomService'}});
    if (first) {
      Session.set('selectedService', first.type);
    } else {
      Session.set('selectedService', 'hotelServicesDescription');
    }
  }
});

// see subscriptions triggered in main.js
Router.route('/room-service', function() {
  this.render('roomService', {
    data: function () {
      return {
        configuration: HotelServices.findOne({type: 'roomService'})
      }
    }
  });
}, {
  name: 'roomService', 
  waitOn: function() {
    var stayId = Session.get('stayId');
    var hotels = Hotels.find();
    var hotel = Hotels.findOne();
    var user = Meteor.user();
    var onboarding = Session.get('onboarding');

    var cartId = Meteor.default_connection._lastSessionId;
    console.log('wait on room service');

    if (stayId && !onboarding) {
      console.log('cart is stayid');
      cartId = stayId;
    }  

    if (hotel) {
      console.log('cart', cartId);
      return [
        subs.subscribe('hotelMenu', hotel._id),
        subs.subscribe('cart', cartId)
      ]; 
    }
  },
  onRun: function() {
    Session.set('selectedService', 'roomService');
    this.next();
  }
});

// see subscriptions triggered in main.js
Router.route('/experiences/:categoryId', function() {
  this.render('experiences', {
    data: function() {
      var activeCategoryId = this.params.categoryId;
      var experienceFilters = Session.get('experienceFilters');

      var experiencesQuery = {
        categoryId: activeCategoryId
      };
      if (experienceFilters && experienceFilters.length > 0) {
        _.each(experienceFilters, function (filter) {
          var key = filter.group + 'Tags';
          if (typeof experiencesQuery[key] === 'undefined') {
            experiencesQuery[key] = {};
          }

          if (typeof experiencesQuery[key].$in === 'undefined') {
            experiencesQuery[key].$in = [];
          }
          experiencesQuery[key].$in.push(filter.name);
        });
      }
    }
  });
}, {
  name: 'experiences', 
  onRun: function() {
    Session.set('experienceFilters', undefined);
    this.next();
  }
});




// Router.map(function() {

//   // Hotel Staff
//   this.route('setupDevice', {
//     path: '/setup-device',
//     waitOn: function() {
//       return [
//         subs.subscribe('userHotelData')
//       ];
//     }
//   });

//   // Patron Interface
//   this.route('welcome', {
//     path: '/',
//     onRun: function() {
//       Deps.nonreactive(function() {
//         App.track("View Welcome");
//       });
//     }
//   });

//   this.route('orders', { 
//     onRun: function() {
//       Deps.nonreactive(function() {
//         App.track("View Orders");
//       });
//     },
//     waitOn: function() {
//       return [
//         subs.subscribe('orders')
//       ];
//     }
//   });

//   this.route('hotelServices', {
//     path: '/hotel-services',
//     onRun: function () {
//       var first = HotelServices.findOne({type: {$not: 'roomService'}});
//       if (first) {
//         Session.set('selectedService', first.type);
//       } else {
//         Session.set('selectedService', 'hotelServicesDescription');
//       }
//     },
//     data: function () {
//       var selectedService = Session.get('selectedService');
//       return {
//         configuration: HotelServices.findOne({type: selectedService})
//       };
//     }
//   });

//   this.route('roomService', {
//     path: '/room-service', 
//     waitOn: function() {
//       var stayId = Session.get('stayId');
//       var hotels = Hotels.find();
//       var hotel = Hotels.findOne();
//       var user = Meteor.user();
//       var onboarding = Session.get('onboarding');

//       var cartId = Meteor.default_connection._lastSessionId;
//       console.log('wait on room service');

//       if (stayId && !onboarding) {
//         console.log('cart is stayid');
//         cartId = stayId;
//       }  

//       if (hotel) {
//         console.log('cart', cartId);
//         return [
//           subs.subscribe('hotelMenu', hotel._id),
//           subs.subscribe('cart', cartId)
//         ]; 
//       }
        
//     },
//     onRun: function() {
//       Session.set('selectedService', 'roomService');
//     },
//     data: function () {
//       return {
//         configuration: HotelServices.findOne({type: 'roomService'})
//       }
//     }
//   });

//   this.route('experiences', {
//     path: '/experiences/:categoryId',
//     onRun: function() {
//       Session.set('experienceFilters', undefined);
//       var that = this;
//       Deps.nonreactive(function() {
//         category = Categories.findOne(that.params.categoryId);

//         if (category) {
//           App.track("View Category", {
//             "Name": category.name
//           });  
//         }
        
//       });
//     },
//     data: function() {
//       var activeCategoryId = this.params.categoryId;
//       var experienceFilters = Session.get('experienceFilters');

//       var experiencesQuery = {
//         categoryId: activeCategoryId
//       };
//       if (experienceFilters && experienceFilters.length > 0) {
//         _.each(experienceFilters, function (filter) {
//           var key = filter.group + 'Tags';
//           if (typeof experiencesQuery[key] === 'undefined') {
//             experiencesQuery[key] = {};
//           }

//           if (typeof experiencesQuery[key].$in === 'undefined') {
//             experiencesQuery[key].$in = [];
//           }
//           experiencesQuery[key].$in.push(filter.name);
//         });
//       }
//       return {
//         experiences: Experiences.find(experiencesQuery, {sort: {sortOrder: 1}}),
//         category: Categories.findOne({_id: activeCategoryId})
//       };
//     }
//   });

// });

