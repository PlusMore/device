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
  }
};


Router.onBeforeAction('loading');


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
    },
    onRun: function() {
      var section = Router.current().route.name;
      Session.set('section', section.toLowerCase());
    }
  });

  this.route('experience', {
    path: '/experience/:_id',
    layoutTemplate: 'deviceLayout',
    onRun: function () {
      Session.set('currentExperienceId', this.params._id);
    },
    data: function () {
      return {
        experience: Experiences.findOne(this.params._id)
      };
    }
  });

});
