/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

// Config

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  yieldTemplates: {
    'header': { to: 'header' }
  }
});

// Filters

var filters = {

  isLoggedIn: function() {
    if (! Meteor.user()) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      }
      else {
        this.render('entrySignIn');
      }
      this.stop();
    }
  },
  isLoggedOut: function() {
    if (Meteor.user()) {
      this.stop();
      Router.go('dashboard');
    }
  }
};

var helpers = {
  analyticsRequest: function() {
    console.log('Make analytics request here', this, Meteor.user());
  },
  showLoadingBar: function() {
    if (this.ready()) {
      NProgress.done();
    } else {
      NProgress.start();
      this.stop();
    }
  }
};

// If logged in, redirect requests to account pages to dashboard
Router.before(filters.isLoggedOut, {only: [
  "entrySignIn",
  "entrySignUp",
  "homepage"
]});

// Check authenticated
Router.before(filters.isLoggedIn, {only: [
  'dashboard',
  'createExperience'
]});

// Show loading bar for any route that loads a subscription
Router.before(helpers.showLoadingBar, {only: [
  'experiences',
  'eperience'
]});


Router.after(helpers.analyticsRequest);

// Routes

Router.map(function() {

  // Experiences

  this.route('createExperience', {
    path: '/create-experience',
    waitOn: function() {
      return Meteor.subscribe('myInProgressExperiences')
    }
  })

  this.route('experiences', {
    yieldTemplates: {
      'experienceHeader': { to: 'header' }
    },
    waitOn: function () {
      return Meteor.subscribe('activeExperiences');
    },
    data: function () {
      return {
        experiences: Experiences.find()
      }
    }
  });

  this.route('experience', {
    path: '/experience/:_id',
    waitOn: function () {
      return Meteor.subscribe('singleExperience', this.params._id);
    },
    data: function () {
      return {
        experience: Experiences.findOne(this.params._id)
      }
    }
  });


  // Pages

  this.route('homepage', {
    path: '/'
  });

  // Dashboard

  this.route('dashboard', {
    path: '/dashboard'
  });

  // Accounts-entry
  this.route('signUpContentManager', {
    template: 'entrySignUp',
    path: '/sign-up/content-manager',
    before: function() {
      Session.set('userSignUpType', 'content-manager');
    }
  });

  this.route('signUpDeviceManager', {
    template: 'entrySignUp',
    path: '/sign-up/device-manager',
    before: function() {
      Session.set('userSignUpType', 'device-manager');
    }
  });

  // // Accounts
  this.route('signup');

});
