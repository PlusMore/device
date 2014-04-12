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
  baseSubscriptions: function() {
    this.subscribe('userHotelData').wait();
    this.subscribe('userDeviceData').wait();
  },
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
  isLoggedOut: function(pause) {
    if (Meteor.user()) {
      pause();
      Router.go('dashboard');
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

var helpers = {
  identify: function () {
    var user = Meteor.user();

    if (! user)
      return;
      
    var device = Devices.findOne(user.deviceId);

    if (device) {
      mixpanel.identify(user._id);
      mixpanel.people.set({
        "Device": device.location
      });
    } else if (user.emails && user.emails[0].address) {
      mixpanel.identify(user._id);
      mixpanel.people.set({
        '$email': user.emails[0].address
      });
    }
  },
  analyticsRequest: function() {
    if (Meteor.isClient) {  
      var name = Router.current().route.name;
      mixpanel.track("page view", {name: name});
    }
  },
  showLoadingBar: function(pause) {
    if (this.ready()) {
      NProgress.done();
    } else {
      NProgress.start();
    }
  }
};
Router.onBeforeAction('loading');
Router.onBeforeAction(filters.baseSubscriptions);

Router.onBeforeAction(helpers.identify);

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

Router.onRun(_.debounce(helpers.analyticsRequest, 300));

// Routes

Router.map(function() {

  // Hotel Staff
  this.route('setupDevice', {
    path: '/setup-device',
    layoutTemplate: 'deviceLayout',
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

  this.route('patronOrderPage', {
    path: 'patron-order/:_id',
    onBeforeAction: function(pause) {
      filters.isLoggedIn(pause, this, filters.isHotelStaff());
    },
    waitOn: function() {
      return [
        Meteor.subscribe('patronOrder', this.params._id)
      ]
    },
    data: function() {
      var order = Orders.findOne(this.params._id);
      if (order) {
        var experience = Experiences.findOne(order.reservation.experienceId)
        return {
          order: order,
          experience: experience
        }
      }
    }
  });

  // Patron Interface
  this.route('welcome', {
    path: '/',
    controller: DeviceController
  });

  this.route('orders', {
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
    },
    controller: DeviceController,
    data: function () {
      return {
        experiences: Experiences.find({category: this.params.category}, {sort: {sortOrder: 1}})
      };
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
