var subs = new SubsManager();

// Config

Router.configure({
  layoutTemplate: 'deviceLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

// Filters

var filters = {
  // Redirects to sign-in screen unless user is logged in or logging in.
  // Sets session variable for current path for post-sign-in redirect.
  isLoggedIn: function(router, pause, extraCondition) {
    if (extraCondition === null) {
      extraCondition = true;
    }
    if (!Meteor.loggingIn()) {
      if (!(Meteor.user() && extraCondition)) {
        Session.set('fromWhere', router.path);
        router.redirect('/sign-in');
        Session.set('entryError', t9n('error.signInRequired'));
        pause.call();
      }
    }
  },
  // package - alanning:roles
  isAdmin: function() {
    return Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  isDevice: function() {
    return Roles.userIsInRole(Meteor.userId(), ['device']);
  },
  isHotelStaff: function() {
    return Roles.userIsInRole(Meteor.userId(), ['hotel-staff', 'admin']);
  },
  // currentExperienceId is used in views/experiences to show corresponding 'experience'
  clearCurrentExperienceId: function() {
    Session.set('currentExperienceId', undefined);
  },
  // Scrolls page to top
  scroll: function() {
    Meteor.setTimeout(function(){
      $('.main').animate({scrollTop: 0}, 400);
    });   
  }
};

Router.onBeforeAction('loading');

if (Meteor.isClient) {
  Router.onBeforeAction(Errors.clearSeen);
  Router.onRun(filters.clearCurrentExperienceId);
  Router.onRun(filters.scroll);
}

// Routes

Router.map(function() {

  // Hotel Staff
  this.route('setupDevice', {
    path: '/setup-device',
    waitOn: function() {
      return [
        this.subscribe('userHotelData')
      ];
    }
  });

  // Patron Interface
  this.route('welcome', {
    path: '/',
    onRun: function() {
      Deps.nonreactive(function() {
        App.track("View Welcome");
      });
    }
  });

  this.route('enterCheckoutDate', {
    path: '/enter-checkout-date',
    onRun: function() {
      Deps.nonreactive(function() {
        App.track("View Enter Checkout Date");
      });
    }
  });

  this.route('orders', { 
    onRun: function() {
      Deps.nonreactive(function() {
        App.track("View Orders");
      });
    },
    waitOn: function() {
      return [
        subs.subscribe('orders')
      ];
    }
  });

  this.route('hotelServices', {
    path: '/hotel-services',
    onRun: function () {
      var first = HotelServices.findOne({type: {$not: 'roomService'}});
      if (first) {
        Session.set('selectedService', first.type);
      } else {
        Session.set('selectedService', 'hotelServicesDescription');
      }
    },
    data: function () {
      var selectedService = Session.get('selectedService');
      return {
        configuration: HotelServices.findOne({type: selectedService})
      };
    }
  });

  this.route('hotelInformation', {
    path: '/hotel-info'
  });

  this.route('roomService', {
    path: '/room-service', 
    waitOn: function() {
      var stayId = Session.get('stayId');
      var hotels = Hotels.find();
      var hotel = Hotels.findOne();
      var user = Meteor.user();
      // boolean for registration required
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
    },
    data: function () {
      return {
        configuration: HotelServices.findOne({type: 'roomService'})
      }
    }
  });

  this.route('experiences', {
    path: '/experiences/:categoryId',
    onRun: function() {
      Session.set('experienceFilters', undefined);
      var that = this;
      Deps.nonreactive(function() {
        category = Categories.findOne(that.params.categoryId);

        if (category) {
          App.track("View Category", {
            "Name": category.name
          });  
        }
        
      });
    },
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
      return {
        experiences: Experiences.find(experiencesQuery, {sort: {sortOrder: 1}}),
        category: Categories.findOne({_id: activeCategoryId})
      };
    }
  });

});

