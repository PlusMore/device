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
  isLoggedIn: function(pause, router, extraCondition) {
    if (! Meteor.user()) {
      if (Meteor.loggingIn()) {
        router.render(this.loadingTemplate);
      }
      else {
        Session.set('fromWhere', router.path)
        // this.render('entrySignIn');
        var path = Router.routes['entrySignIn'].path();
        Router.go(path);
      }
      pause()
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
        Session.set('deviceIsRegistered', false);
        this.render('registerDevice');
      }
      pause();
    } else {
      if (!Roles.userIsInRole(Meteor.userId(), ['device'])) {    
        Session.set('deviceIsRegistered', false);
        this.render('registerDevice');
        pause();
      } else {    
        Session.set('deviceIsRegistered', true);
      }
    }
  },
  resetActiveCategory: function() {
    Session.set('activeCategory', '');
  }
};

Router.onBeforeAction('loading');

Router.onBeforeAction(filters.resetActiveCategory, {only: [
  'orders',
  'welcome'
]})
// Ensure user has a device account, otherwise,
// redirect to device list?
// TODO: Need to think about this.. Can we get patron's
// information somehow? Maybe can change from auto login
// to a form.
Router.onBeforeAction(filters.ensureDeviceAccount, {only: [
  'welcome',
  'experiences',
  'experience',
  'orders'
]});

// Routes

Router.map(function() {

  // Hotel Staff
  this.route('setupDevice', {
    path: '/setup-device',
    layoutTemplate: 'deviceLayout',
    waitOn: function() {
      return [
        this.subscribe('userHotelData')
      ]
    },
    onBeforeAction: function(pause) {
      filters.isLoggedIn(pause, this, filters.isHotelStaff());
    },
    onData: function() {
      if (Meteor.user()) {  
        var hotel = Hotels.findOne(Meteor.user().hotelId);
        if (hotel) {
          Session.set('hotelName', hotel.name);
          Session.set('hotelId', hotel.id);
        }
      }
    },
    data: function () {
      if (Meteor.user()) {
        return {
          hotel: Hotels.findOne(Meteor.user().hotelId)
        }
      }
    }
  });

  // Patron Interface
  this.route('welcome', {
    path: '/',
    onBeforeAction: function() {
      Session.set('experienceState', '');
    },
    onRun: function () {
      var section = Router.current().route.name;
      Session.set('section', section.toLowerCase());
    }
  });

  this.route('enterCheckoutDate', {
    path: '/enter-checkout-date',
    onBeforeAction: function() {
      Session.set('experienceState', '');
    },
    onRun: function () {
      var section = Router.current().route.name;
      Session.set('section', section.toLowerCase());
    }
  });

  this.route('orders', {
    waitOn: function() {
      this.subscribe('orders')
    },
    controller: DeviceController
  });

  this.route('frontDesk', {
    controller: DeviceController,
  });

  this.route('transportation', {
    controller: DeviceController
  });

  this.route('experiences', {
    path: '/experiences/:category?',
    onBeforeAction: function() {
      Session.set('experienceState', '');
      Session.set('activeCategory', this.params.category);
      var section = this.route.name;
      Session.set('section', section.toLowerCase());
    },
    onRun: function() {
      Deps.nonreactive(function() {
        App.track("View Category", {
          "Name": Router.current().params.category
        });
      });
    },
    action: function () {
    }
  });

  this.route('experience', {
    path: '/experience/:_id',
    layoutTemplate: 'deviceLayout',
    onRun: function () {
      Deps.nonreactive(function() {
        Session.set('currentExperienceId', Router.current().params._id);
        var experience = Experiences.findOne(Router.current().params._id);
        console.log(experience);

        App.track("View Experience", {
          "Experience Title": experience.title,
          "Experience Category": experience.category,
          "Experience Lead": experience.lead,
          "Experience PhotoUrl": experience.photoUrl,
          "Experience Id": experience._id,
          "Experience Description": experience.description,
          "City": experience.city
        });
      });
    },
    data: function () {
      return {
        experience: Experiences.findOne(this.params._id)
      };
    },
    action: function () {
    }
  });

});
