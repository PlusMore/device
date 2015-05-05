Template.bookNow.created = function () {
  var instance = this;
  instance.state = new ReactiveVar('default');
};

Template.bookNow.rendered = function() {
  initializePickers(this);
}

Template.bookNow.destroyed = function () {
  this.state = null;
  destroyPickers(this);
};

Template.bookNow.helpers({
  state: function () {
    var templateInstance = Template.instance();
    if (templateInstance && templateInstance.state) {
      return templateInstance.state.get();
    }
    return '';
  },
  confirm: function () {
    var templateInstance = Template.instance();
    if (templateInstance && templateInstance.state) {
      return templateInstance.state.get() === 'confirm';
    }

    return false;
  },
  inputContainerClasses: function() {
    if (ResponsiveHelpers.isXs()) {

      var templateInstance = Template.instance();
      if (templateInstance && templateInstance.state) {

        if (templateInstance.state.get() === 'confirm') {
          return 'fadeInUpBig'
        } else if (templateInstance.state.get() === 'hiding') {
          return 'fadeOutDownBig'
        } else {
          return 'hidden'
        }

      }
    }

    return '';
  },
  isXs: function() {
    return ResponsiveHelpers.isXs();
  },
  firstRowClass: function() {
    // if not xs and displayed, then this is the first row
    if (!ResponsiveHelpers.isXs()) {
      return 'first-row';
    }

    return '';
  }
});

Template.bookNow.events({
  'click .close-reservation-form': function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation()

    var instance = Template.instance();
    instance.state.set('hiding');
    Meteor.setTimeout(function() {
      instance.state.set('default');
    }, 400);
    return false;
  },
  'click .btn-call-to-action.default': function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation()

    if (!ResponsiveHelpers.isXs()) {
      if (tmpl.unavailable) {
        alert('No more available times for selected date. Please try another date.');
        return false;
      }
    }

    Template.instance().state.set('confirm');
    return false;
  },
  'click .btn-call-to-action.confirm': function(e, tmpl) {
    if (tmpl.unavailable) {
      alert('No more available times for selected date. Please try another date.');
      e.preventDefault();
      e.stopImmediatePropagation()
      return false;
    }
  },
  'click .btn-call-to-action.hiding': function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation()
    return false;
  },
  'submit form': function(e, tmpl) {
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

    $(document).one('user-selected', function() {
      $(document).off('user-selected');
      $(document).off('cancel-user-selected');


      Session.set('loader', 'Requesting Reservation');
      Meteor.call('makeReservation', reservation, function(err, result) {
        if (err) {
          Errors.throw(err.message);
          Session.set('loader', undefined);
          return;
        }

        Router.go('recent-orders');
        experienceModal.close();
        Meteor.setTimeout(function() {
          Session.set('loader', undefined);
        }, 500);

      });
    });

    $(document).one('cancel-user-selected', function() {
      $(document).off('user-selected');
      $(document).off('cancel-user-selected');

      return;
    });

    if (!Meteor.user()) {
      modal.show('selectUser');
    } else {
      $(document).trigger('user-selected');
    }
  }
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
  console.log('initializing pickers for experience', experience);

  // the delay for this type of category in half hour intervals
  // a three hour delay, for example, is 6
  // delays are from the end of the current half hour block
  var delay = getCategoryDelay(experience.category);
  var delayHours = delay / 2;

  var startMinutes = experience.reservationStartMinutes;
  var endMinutes = experience.reservationEndMinutes;
  var startTime, endTime;

  var startTomorrow = false;

  // timepicker options
  var timepickerOptions = {
    container: 'body',
    clear: null,
    onSet: function(select) {
      // if use selected a time, store the time value in minute on the template
      // storing it on the template allows the datepicker to access the data
      var selectedTimeInMinutes = select.select;
      if (selectedTimeInMinutes) {
        template.selectedMinutes = selectedTimeInMinutes;
      }
    }
  };

  // if there is a start time defined, set the 'min' in timepickeroptions
  // the value should be today's date at the time reservations are allowed
  // calculate that by finding the start of the day and adding startMinutes to it
  // if hours are not defines, default to 4pm for now
  if (typeof startMinutes !== 'undefined') {
    startTime = moment().startOf('day');
    startTime = startTime.minutes(startMinutes);
    timepickerOptions.min = startTime.toDate();
  } else {
    timepickerOptions.min = moment().startOf('day').hours(16).toDate();
  }

  // now find the max option for the timepicker
  // do the same calculation for startTime to also find the endTime.
  // if endMinutes is less that than startMinutes, the end is the next day
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
    format: 'dddd, mmmm d',
    clear: null,
    onSet: function(select) {
      // when a date is selected, we need set the time availability for that day
      // if it is today, we need to set the minimum time to now plus the delay
      // required to be able to get the reservation

      // set selectedDate on template that way timepicker can access it
      template.selectedDate = select.select;
      var selectedDate = select.select;

      // the timepicker control
      var timepicker = template.timepicker.pickatime('picker');
      var currentSelectedTime = timepicker.component.item.select && timepicker.component.item.select.pick;

      // make sure it's enabled
      timepicker.set('enable', true);

      // if an invalid date has been selected, we need to allow selection of all times
      // for when a guest then selects a date
      if (!selectedDate) {
        // set the min to the start of the availability
        timepicker.set('min', startTime.toDate());

        // if the currently selected time is before min, select min
        // as the currently selected time is not possible
        if (timepicker.get('min').pick > currentSelectedTime) {
          timepicker.set('select', timepicker.get('min').pick);
        } else {
          timepicker.set('select', currentSelectedTime);
        }

        return true;
      }

      // is datepicker being set for today?
      // calculate the available times for today
      // is right now + required delay between the start time and end time for reservations?
      var isToday = moment(selectedDate).startOf('day').toDate().getTime() === moment().startOf('day').toDate().getTime();
      var inAvailablityHours = false;
      if (isToday) {

        // if delay/2 hours from now are in between start and end
        // set first available time to be delay hours from now
        // delay is in half hour intervals
        var nowPlusDelay = moment().add(delayHours, 'hours');

        // the api for this is a bit weird, but 'min' accepts a number value
        // which is used as the min number of time blocks, which default to 30 minutes,
        // from the current time. 3 hours is about 6 half hour delays
        // if nowPlusDelay is not within the availability time, then set the
        // min time to the first available time from startTime
        if ( (nowPlusDelay > startTime) && (nowPlusDelay < endTime) ) {
          inAvailablityHours = true;
          timepicker.set('min', delay);
        } else if (nowPlusDelay < startTime){
          timepicker.set('min', startTime.toDate());
        } else if (nowPlusDelay > endTime) {
          timepicker.set('min', startTime.toDate());
          timepicker.set('disable', true);

          $('#call-to-action .btn-primary').addClass('unavailable');
          $('#mobile-call-to-action .btn-primary.confirm').addClass('unavailable');
          template.unavailable = true;

          Meteor.defer(function() {
            timepicker.clear();
          });
          return true;
        }

        // if the currently selected time is before min, select min
        // as the currently selected time is not available for the given date
        if (timepicker.get('min').pick > currentSelectedTime) {
          timepicker.set('select', timepicker.get('min').pick);
        }

      } else {
        // if it's not today, any selected time will work, and set min to first
        // available time
        timepicker.set('min', startTime.toDate());
        // if the currently selected time is before min, select min
        // as the currently selected time is not available for the given date
        if (timepicker.get('min').pick > currentSelectedTime) {
          timepicker.set('select', timepicker.get('min').pick);
        } else {
          timepicker.set('select', currentSelectedTime);
        }
      }

      $('#call-to-action .btn-primary').removeClass('unavailable');
      $('#mobile-call-to-action .btn-primary').removeClass('unavailable');
      template.unavailable = false;
      return true;
    }
  };

  // trying something new, always set min to today, when user tries to book for
  // today, show a message saying there is no more availability
  startTomorrow = false;
  datepickerOptions.min = true;

  // on initialize, select the date determined above, which is either today or
  // tomorrow
  datepickerOptions.onStart = function() {
    var _this = this;
    Meteor.setTimeout(function(){
      if (startTomorrow) {
        _this.set('select', moment().add(1, 'days').toDate());
      } else {
        _this.set('select', new Date());
      }
    });
  };

  // and select the first available time
  timepickerOptions.onStart = function() {
    var _this = this;
    Meteor.setTimeout(function(){
      _this.set('select', _this.get('min').pick);
    });
  };

  // make the pickers scrollable
  timepickerOptions.onRender = function() {
    return this.$root.find('.picker__holder:first').addClass('scrollable');
  };

  // alright, all the options have been calculated, and we told the pickers
  // how to handle dates and times being changed
  // now just initialize by passing in the options
  template.timepicker = this.$('.timepicker').pickatime(timepickerOptions);
  template.datepicker = this.$('.datepicker').pickadate(datepickerOptions);

  template.datepicker.pickadate('picker').on({
    open: App.pickerOpenedHax,
    close: App.pickerClosedHax
  });

  template.timepicker.pickatime('picker').on({
    open: function() {
      console.log('opened timepicker');
      if (template.unavailable) {
        alert('No more available times for selected date. Please try another date.');
        this.close();
        return;
      }

      return App.pickerOpenedHax.call(this);
    },
    close: App.pickerClosedHax
  });
};

var destroyPickers = function(template) {
  template.datepicker.stop();
  template.timepicker.stop();

  $('.picker', 'body').remove();

  template.datepicker = null;
  template.timepicker = null;
};
