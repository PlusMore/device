initializeServicePickers = function(template, startMinutes, endMinutes) {
  startMinutes = startMinutes || 0;
  endMinutes = endMinutes || 23 * 60 + 45;

  var delay = 1;


  var startTime, endTime;
  var startTomorrow = false;

  var checkoutDate;
  var stay = Stays.findOne();

  if (stay) {
    checkoutDate = stay.checkoutDate;
  }
  // timepicker options
  var timepickerOptions = {
    container: 'body',
    clear: null,
    interval: 15,
    onSet: function(select) {
      if (select.select) {
        Session.set('selectedMinutes', select.select);
        // template.selectedMinutes = select.select;
      }
    }
  };

  if (typeof startMinutes !== 'undefined') {
    startTime = moment().startOf('day');
    startTime = startTime.minutes(startMinutes);
    timepickerOptions.min = startTime.toDate();
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
      // template.selectedDate = select.select;
      Session.set('selectedDate', select.select);

      var timepicker = template.timepicker.pickatime('picker');

      var currentSelect = timepicker.component.item.select && timepicker.component.item.select.pick;

      if (!select.select) {
        timepicker.set('min', startTime.toDate());

        // if selectedtime is before min, select min
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

  // if now is less than startTime
  if (moment() < startTime) {
    // if it is today at 3pm, and start time is
    // at 5pm, start at today in datepicker
    datepickerOptions.min = true;
  } else if ((moment() > startTime) && (moment() < endTime)) {
    // if we are inside of hours
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
    Meteor.setTimeout(function() {
      if (startTomorrow) {
        _this.set('select', moment().add('days', 1).toDate());
      } else {
        _this.set('select', new Date());
      }
    });
  };

  timepickerOptions.onStart = function() {
    var _this = this;
    Meteor.setTimeout(function() {
      _this.set('select', _this.get('min').pick);
    });
  };

  timepickerOptions.onRender = function() {
    return this.$root.find('.picker__holder:first').addClass('scrollable');
  };


  template.datepicker = this.$('.datepicker').pickadate(datepickerOptions);
  template.timepicker = this.$('.timepicker').pickatime(timepickerOptions);

  template.datepicker.pickadate('picker').on({
    open: App.pickerOpenedHax,
    close: App.pickerClosedHax
  });

  template.timepicker.pickatime('picker').on({
    open: App.pickerOpenedHax,
    close: App.pickerClosedHax
  });
};

destroyServicePickers = function(template) {
  template.datepicker.stop();
  template.timepicker.stop();

  $('.picker', 'body').remove();

  template.datepicker = null;
  template.timepicker = null;
};
