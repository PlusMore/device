Template.makeReservationCallToAction.rendered = function () {
  initializePickers(this);
};

Template.makeReservationCallToAction.destroyed = function () {
  destroyPickers(this);
};

Template.makeReservationCallToAction.events({
  'touchstart .btn-call-to-action, click .btn-call-to-action': function(e, tmpl) {
    e.preventDefault();

    var user = Meteor.user();
    var experience = tmpl.data;
    var reservationMoment = moment(tmpl.selectedDate).startOf('day').add(tmpl.selectedMinutes, 'minutes');

    var reservation = {
      partySize: parseInt(tmpl.$('[name=partySize]').val(), 10),
      date: reservationMoment.toDate(),
      zone: Session.get('zone'),
      experienceId: Session.get('currentExperienceId')
    };

    Session.set('reservation', reservation);

    App.track('Click Book Now', {
      "Reservation Date": moment(reservation.date).zone(reservation.zone).calendar(),
      "Party Size": reservation.partySize,
      "Experience Title": experience.title
    });

    $(document).one('user-selected', function() {
      $(document).off('user-selected');
      $(document).off('cancel-user-selected');

      $('#confirm-reservation').modal({
        backdrop: 'static'
      });
    });

    $(document).one('cancel-user-selected', function() {
      $(document).off('user-selected');
      $(document).off('cancel-user-selected');
      
      return Errors.throw('Please log in to use this feature.');
    });

    if (!Meteor.user()) {
      Session.set('selectUser', true);
    } else {
      $(document).trigger('user-selected');
    }
  }
});

Template.makeReservationCallToAction.helpers({
  inOperatingHours: function() {
    var now = moment();
    // 11am
    var start = moment().startOf('day').hours(11);
    // end 11:59pm
    var end = moment().endOf('day');

    if (now.isAfter(start) && now.isBefore(end)) {
      return true;
    }

    return false;
  },
});

var getCategoryDelay = function(category) {
  var delay = 6;

  if (category === 'Nightlife') {
    delay = 6;
  }

  return delay;
};

var initializePickers = function(template) {
  var experience = Experiences.findOne(template.data._id);

  var delay = getCategoryDelay(experience.category);

  var startMinutes = experience.reservationStartMinutes;
  var endMinutes = experience.reservationEndMinutes;
  var startTime, endTime;
  var startTomorrow = false;

  var checkoutDate = undefined;
  var stay = Stays.findOne();

  if (stay) {
    checkoutDate = stay.checkoutDate;
  }

  // timepicker options
  var timepickerOptions = {
    container: 'body',
    clear: null,
    onSet: function(select) {
      
      if (select.select) {
        template.selectedMinutes = select.select;
      }
    }
  };

  if (typeof startMinutes !== 'undefined') {
    startTime = moment().startOf('day');
    startTime = startTime.minutes(startMinutes);
    timepickerOptions.min = startTime.toDate();
  } else {
    timepickerOptions.min = moment().startOf('day').hours(16).toDate();
  }
  
  if (typeof endMinutes !== 'undefined') {
    // If end is less than start, it's AM next day
    if (endMinutes <= startMinutes) {
      endTime = moment().startOf('day').add('days', 1).minutes(endMinutes);
    } else {
      endTime = moment().startOf('day').minutes(endMinutes);
    }
    timepickerOptions.max = endTime.toDate();
  }

  var datepickerOptions = {
    container: 'body',
    max: checkoutDate,
    format: 'dddd, mmmm d',
    clear: null,
    onSet: function(select) {
      // set selectedDate on template
      template.selectedDate = select.select;

      var timepicker = template.timepicker.pickatime('picker');

      var currentSelect = timepicker.get('select').pick;

      if (!select.select) {
        timepicker.set('min', startTime.toDate());

        // if selectedtim is before min, select min
        if (timepicker.get('min').pick > currentSelect) {
          timepicker.set('select', timepicker.get('min').pick);
        } 
        
        return true; 
      }

      var isToday = moment(select.select).startOf('day').toDate().getTime() === moment().startOf('day').toDate().getTime();
      if (isToday) {
        // if two hours from now are in between start and end
        // set first available time to be {{delay}} hours from now
        if ((moment().add('hours', delay) > startTime) && (moment().add('hours', delay) < endTime)) {
          timepicker.set('min', delay);
        } else {
          timepicker.set('min', startTime.toDate());
        }

        // if selectedtime is before min, select min
        if (timepicker.get('min').pick > currentSelect) {
          timepicker.set('select', timepicker.get('min').pick);
        } 

      } else {
        timepicker.set('min', startTime.toDate());
      }

      return true;
    }
  };

  if (moment() < startTime) {
    // if it is today at 3pm, and reservations start 
    // at from 5pm, start at today in datepicker
    datepickerOptions.min = true;
  } else if ((moment() > startTime) && (moment() < endTime)) {
    // if we are inside of reservation hours
    // then start datepicker at today
    datepickerOptions.min = true;
    // unless {{delay}} hours from now is past endTime, don't allow 
    // any more reservations
    if (moment().add('hours', delay) > endTime) {
      startTomorrow = true;
      datepickerOptions.min = 1;
    }
  } else {
    // after hours, make datepicker start tomorrow
    startTomorrow = true;
    datepickerOptions.min = 1;
  }

  datepickerOptions.onStart = function() {
    var _this = this;
    Meteor.setTimeout(function(){
      if (startTomorrow) {
        _this.set('select', moment().add('days', 1).toDate());
      } else {
        _this.set('select', new Date());
      }
    }); 
  };

  timepickerOptions.onStart = function() {
    var _this = this;
    Meteor.setTimeout(function(){
      _this.set('select', _this.get('min').pick);
    });    
  };

  timepickerOptions.onRender = function() {
    return this.$root.find('.picker__holder:first').addClass('scrollable');
  };


  template.datepicker = this.$('.datepicker').pickadate(datepickerOptions);
  template.timepicker = this.$('.timepicker').pickatime(timepickerOptions);
};

var destroyPickers = function(template) {
  $('.picker', 'body').remove();
  $(template.datepicker).stop();
  template.datepicker = null;
  $(template.timepicker).stop();
  template.timepicker = null;
};