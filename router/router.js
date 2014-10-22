/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

// Config

Router.configure({
  layoutTemplate: 'deviceLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

// Filters

var filters = {
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
  isAdmin: function() {
    return Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  isDevice: function() {
    return Roles.userIsInRole(Meteor.userId(), ['device']);
  },
  isHotelStaff: function() {
    return Roles.userIsInRole(Meteor.userId(), ['hotel-staff', 'admin']);
  },
  ensureDeviceAccount: function(pause) {
    if (! Meteor.user()) {  

      if (Meteor.loggingIn()) {    
        this.render(this.loadingTemplate);
        
      } else {    
        this.render('registerDevice');
      }

      pause();

    } else {
      
      if (!Roles.userIsInRole(Meteor.userId(), ['device'])) {    
        this.render('registerDevice');
      } 

    }
  },
  ensureValidStay: function (pause) {
    var stay = Stays.findOne({userId: Meteor.userId()});

    if (stay && stay.checkoutDate < new Date()) {
      Session.set('expired', true);
    }
  },
  resetExperienceState: function() {
    Session.set('experienceState', '');
  },
  clearCurrentExperienceId: function() {
    Session.set('currentExperienceId', undefined);
  },
  scroll: function() {
    Meteor.setTimeout(function(){
      $('.main').animate({scrollTop: 0}, 400);
    });   
  },
  closeMenu: function() {
    App.hideMenu();
  }
};

Router.onBeforeAction('loading');

if (Meteor.isClient) {
  Router.onBeforeAction(Errors.clearSeen);
  Router.onRun(filters.closeMenu);
  Router.onRun(filters.clearCurrentExperienceId);
  Router.onRun(filters.scroll);
}

// Ensure user has a device account, otherwise,
// redirect to device list?
// TODO: Need to think about this.. Can we get patron's
// information somehow? Maybe can change from auto login
// to a form.
Router.onBeforeAction(filters.ensureDeviceAccount, {only: [
  'experiences',
  'experience',
  'orders',
  'enterCheckoutDate'
]});

Router.onBeforeAction(filters.ensureValidStay, {only: [
  'experiences',
  'orders',
  'hotelServices'
]});

Router.onRun(filters.resetExperienceState);


// Routes

Router.map(function() {

  this.route('registerDevice');

  // Hotel Staff
  this.route('setupDevice', {
    path: '/setup-device',
    waitOn: function() {
      return [
        this.subscribe('userHotelData')
      ];
    }
  });

  this.route('settingUp');

  // Patron Interface
  this.route('welcome', {
    path: '/',
    onRun: function() {
      Deps.nonreactive(function() {
        App.track("View Welcome");
      });
    }
  });

  this.route('about', {
    onRun: function() {
      Deps.nonreactive(function() {
        App.track("View What is PlusMore?");
      });
    }
  });
    

  this.route('howToBook', {
    onRun: function() {
      Deps.nonreactive(function() {
        App.track("View How to Book");
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
    }
  });

  this.route('hotelServices', {
    path: '/hotel-services',
    onRun: function () {
      var roomService = HotelServices.findOne({type: 'roomService'});

      if (roomService) {
        Session.set('selectedService', 'roomService'); 
      } else {
        var first = HotelServices.findOne();
        if (first) {
          Session.set('selectedService', first.type);
        } else {
          Session.set('selectedService', 'hotelServicesDescription');
        }
      }

    },
    data: function () {
      var selectedService = Session.get('selectedService');
      return {
        configuration: HotelServices.findOne({type: selectedService})
      };
    }
  });

  this.route('experiences', {
    path: '/experiences/:categoryId',
    onRun: function() {
      Session.set('experienceFilters', undefined);
      Deps.nonreactive(function() {
        category = Categories.findOne(this.params.categoryId);
        App.track("View Category", {
          "Name": category.name
        });
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

