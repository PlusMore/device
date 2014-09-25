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
  resetActiveCategory: function() {
    Session.set('activeCategory', '');
  },
  resetExperienceState: function() {
    Session.set('experienceState', '');
  },
  scroll: function() {
    var scroll = Session.get('overrideNextScrollPosition');
    var scrollPosition = Session.get('lastScrollPosition');
    if (typeof scrollPosition !== 'undefined') {
      if (scroll) {
        console.log('override scroll');
        Meteor.setTimeout(function(){
          $('.content').scrollTop(scrollPosition);
          Session.set('lastScrollPosition', undefined);
          Session.set('overrideNextScrollPosition', false);
        });  
      } else {
        console.log('scrollTop');
        Meteor.setTimeout(function(){
          $('.content').animate({scrollTop: 0}, 600);
          Session.set('lastScrollPosition', undefined);
          Session.set('overrideNextScrollPosition', false);
        });   
      }
    }
  },
  setLastScrollPosition: function() {
    Session.set('lastScrollPosition', $('.content').scrollTop());
    console.log(Session.get('lastScrollPosition'));
  },
  closeMenu: function() {
    Session.set('showMenu', false);
  }
};

Router.onBeforeAction('loading');

if (Meteor.isClient) {
  Router.onBeforeAction(Errors.clearSeen);
}

Router.onRun(filters.closeMenu);

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

Router.onAfterAction(filters.scroll, {except: [
  'experience'
]});
Router.onStop(filters.setLastScrollPosition, {except: [
  'experience'
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
        Session.set('selectedService', first.type);
      }

    },
    data: function () {
      var selectedService = Session.get('selectedService');
      return {
        configuration: HotelServices.findOne({type: selectedService})
      };
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
    },
    data: function() {
      var activeCategory = Session.get('activeCategory');
      return {
        experiences: Experiences.find({category: activeCategory}, {sort: {sortOrder: 1}})
      };
    }
  });

  this.route('experience', {
    path: '/experience/:_id',
    onRun: function () {
      Session.set('currentExperienceId', Router.current().params._id);
    },
    data: function () {
      return {
        experience: Experiences.findOne(this.params._id),
        experienceId: this.params._id
      };
    },
    action: function() {
      // Do nothing, A reactive overlay is shown based on currentExperienceId
      Session.set('overrideNextScrollPosition', true);
    }
  });

});

