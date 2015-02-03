var subs = new SubsManager();

// Config

Router.configure({
  layoutTemplate: 'deviceLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

// Filters

var filters = {
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

Router.route('/orders/recent', function() {
  this.render('ordersRecent');
}, {
  name: 'recent-orders',
  waitOn: function() {
    return Meteor.subscribe('ordersRecent');
  }
});

Router.route('/orders/history', function() {
  this.render('ordersHistory');
}, {
  name: 'orders-history',
  waitOn: function() {
    return Meteor.subscribe('ordersHistory');
  }
});

Router.route('/hotel-info', function () {
  this.render('hotelInformation');
}, {
  name: 'hotelInformation',
  waitOn: function () {
    var hotel = Hotels.findOne();
    if (hotel) {
      return [
        subs.subscribe('hotelAmenities', hotel._id),
        subs.subscribe('amenityDetails', hotel._id)
      ]
    }
    
  }
});

Router.route('/nav-config', function () {
  this.render('navEditor');
}, {
  name: 'navEditor',
  waitOn: function () {
    return [
      subs.subscribe('navCategories'),
      subs.subscribe('navLinks')
    ]
  }
});

// see subscriptions triggered in main.js
Router.route('/hotel-services', function() {
  this.render('hotelServices', {
    data: function () {


      if (!Session.get('selectedService')) {
        var first = HotelServices.findOne({type: {$not: 'roomService'}});
        if (first) {
          Session.set('selectedService', first.type);
        } else {
          Session.set('selectedService', 'hotelServicesDescription');
        }  
      }
      

      var selectedService = Session.get('selectedService');

      return {
        configuration: HotelServices.findOne({type: selectedService})
      };
    }
  });
}, {
  name: 'hotelServices'
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
      return {
        experiences: Experiences.find(experiencesQuery, {sort: {sortOrder: 1}}),
        category: Categories.findOne({_id: activeCategoryId})
      };
    }
  });
}, {
  name: 'experiences', 
  onRun: function() {
    Session.set('experienceFilters', undefined);
    this.next();
  }
});