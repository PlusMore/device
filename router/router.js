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
  ensureValidStay: function (pause) {
    var stay = Stays.findOne({userId: Meteor.userId()});

    if (stay && stay.checkoutDate < new Date()) {
      console.log('expired stay')
      Meteor.call('endStay', stay, function (err, deviceId) {
        if (err) throw new Meteor.Error(err)
        console.log('deviceId', deviceId);
        Meteor.logout();

        Meteor.loginDevice(deviceId, function(err) {
          Router.go('welcome');
        });
      });
    }
  },
  resetActiveCategory: function() {
    Session.set('activeCategory', '');
  },
  resetExperienceState: function() {
    Session.set('experienceState', '');
  },
  fullscreen: function() {
    Session.set('fullscreen', true);
  },
  resetFullscreen: function() {
    Session.set('fullscreen', false);
  }
};

Router.onBeforeAction('loading');

var fullscreenPages = [
  'welcome',
  'experience',
  'setupDevice',
  'enterCheckoutDate',
  'entrySignIn',
  'entrySignUp',
  'entryResetPassword',
  'entryForgotPassword'
];

Router.onBeforeAction(filters.fullscreen, {only: fullscreenPages});
Router.onBeforeAction(filters.resetFullscreen, {except: fullscreenPages});

Router.onBeforeAction(filters.ensureValidStay, {only: [
  'experience',
  'experiences',
  'orders'
]});

Router.onBeforeAction(filters.resetExperienceState);

Router.onBeforeAction(filters.resetActiveCategory, {except: [
  'experience',
  'experiences'
]});
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
    path: '/'
  });

  this.route('enterCheckoutDate', {
    path: '/enter-checkout-date'
  });

  this.route('orders');

  this.route('message');

  this.route('experiences', {
    path: '/experiences/:category?',
    onBeforeAction: function() {
      Session.set('activeCategory', this.params.category);
    },
    onRun: function() {
      Deps.nonreactive(function() {
        App.track("View Category", {
          "Name": Router.current().params.category
        });
      });
    }
  });

  this.route('experience', {
    path: '/experience/:_id',
    onRun: function () {
      Deps.nonreactive(function() {
        Session.set('currentExperienceId', Router.current().params._id);
        var experience = Experiences.findOne(Router.current().params._id);
        console.log(experience);

        if (experience) {
          App.track("View Experience", {
                    "Experience Title": experience.title,
                    "Experience Category": experience.category,
                    "Experience Lead": experience.lead,
                    "Experience PhotoUrl": experience.photoUrl,
                    "Experience Id": experience._id,
                    "Experience Description": experience.description,
                    "City": experience.city
          });
        }
        
      });
    },
    data: function () {
      return {
        experience: Experiences.findOne(this.params._id),
        experienceId: this.params._id
      };
    }
    // ,
    // action: function () {
    // }
  });

});

