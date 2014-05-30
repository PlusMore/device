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
    if (extraCondition == null) {
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

if (Meteor.isClient) {
  Router.onBeforeAction(Errors.clearSeen);
}


var fullscreenPages = [
  'welcome',
  'experience',
  'registerDevice',
  'setupDevice',
  'settingUp',
  'enterCheckoutDate',
  'entrySignIn',
  'entrySignUp',
  'entryResetPassword',
  'entryForgotPassword',
  'experience'
];

Router.onBeforeAction(filters.fullscreen, {only: fullscreenPages});
Router.onBeforeAction(filters.resetFullscreen, {except: fullscreenPages});

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
  'experience',
  'experiences',
  'orders'
]});

Router.onRun(filters.resetExperienceState);

Router.onBeforeAction(filters.resetActiveCategory, {except: [
  'experience',
  'experiences'
]});


// Routes

Router.map(function() {

  this.route('registerDevice');

  // Hotel Staff
  this.route('setupDevice', {
    path: '/setup-device',
    waitOn: function() {
      return [
        this.subscribe('userHotelData')
      ]
    },
    onBeforeAction: function(pause) {
      var isAdminOrHotelStaff = (filters.isHotelStaff() || filters.isAdmin());
      filters.isLoggedIn(this, pause, isAdminOrHotelStaff);
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
    },
    action: function() {
      // Do nothing, A reactive overlay is shown based on currentExperienceId
    }
  });

});

