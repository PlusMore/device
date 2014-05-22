Meteor.startup(function() {
  AutoForm.hooks({
    makeReservation: {
      formToDoc: function(doc) {      
        var dateval = $("#makeReservation").find('[name=date]').val();

        if (dateval) {
          timeMinutes = parseInt(doc.timeMinutes, 10);

          if (timeMinutes) {
            var m = moment(new Date(dateval)).startOf('day').minutes(timeMinutes);
            if (m.isValid()) {
              // before 6am - add day
              if (doc.timeMinutes < (60*6)) {
                m.add('days', 1);
              }
              doc.dateDatetime = m.toDate();
            }
          }
        }
        
        return doc;
      },
      onSuccess: function(operation, result, template) {
        Session.set('experienceState', 'complete');
        AutoForm.resetForm('makeReservation');
      },
      onError: function(operation, error, template) {
        console.log('onError');
        if (error.error) {
          Session.set('experienceState', 'error');
          App.track('Submit Error', error);
        }
      }
    }
  });
});

Template.makeReservationCallToAction.events({
  'click .btn': function(e, tmpl) {
    e.preventDefault();
    Session.set('experienceState', 'in-progress');

    var experience = tmpl.data;
    App.track("Click Make Reservation", {
      "Experience Title": experience.title,
      "Experience Id": experience._id,
      "Experience Lead": experience.lead,
      "Experience PhotoUrl": experience.photoUrl,
      "Experience Category": experience.category,
      "City": experience.city
    });
  }
});

Template.makeReservationForm.helpers({
  today: function() {
    return new Date();
  },
  makeReservationSchema: function () {
    var schema = Schema.makeReservation._schema;
    var _this = this;
    if (this.maxPartySize) {
      schema.partySize.max = this.maxPartySize;
    }
    return new SimpleSchema(schema); 
  },
  showInProgress: function () { 
    return Session.get('experienceState') ==='in-progress' ? 'show' : '';
  },
  showComplete: function () {
    return Session.get('experienceState') ==='complete' ? 'show' : '';
  },
  showError: function () {
    return Session.get('experienceState') === 'error' ? 'show': '';
  },
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
  }
});

Template.makeReservationForm.rendered = function () {
  var _this = this;
  
  // Set experience Id on hidden reservation input
  $(this.$('#makeReservation')).find('[name=experienceId]').val(this.data._id);

  var startMinutes = this.data.reservationStartMinutes;
  var endMinutes = this.data.reservationEndMinutes;
  var startTime, endTime;

  var checkoutDate = Stays.findOne().checkoutDate;

  // timepicker options
  var timepickerOptions = {
    container: 'body',
    onSet: function(select) {
      var minutes = select.select;
      var $reservationOptionsEl = this.$node.closest('.make-reservation-form')
      $reservationOptionsEl.find('[name=timeMinutes]').val(minutes);
    }
  }

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

  timepickerOptions.onRender = function() {
    return this.$root.find('.picker__holder:first').addClass('scrollable');
  }

  var datepickerOptions = {
    container: 'body',
    max: checkoutDate,
    format: 'mmmm d, yyyy',
    onSet: function(select) {
      var timepicker = _this.timepicker.pickatime('picker');
      timepicker.clear();

      var isToday = moment(select.select).startOf('day').toDate().getTime() === moment().startOf('day').toDate().getTime();
      if (isToday) {
        // if two hours from now are in between start and end
        // set first available time to be 2 hours from now
        if ((moment().add('hours', 2) > startTime) && (moment().add('hours', 2) < endTime)) {
          timepicker.set('min', 2);
        } else {
          timepicker.set('min', startTime.toDate());
        }
      } else {
        timepicker.set('min', startTime.toDate());
      }
      return true;
    }
  }

  if (moment() < startTime) {
    // if it is today at 3pm, and reservations start 
    // at from 5pm, start at today in datepicker
    datepickerOptions.min = true;
  } else if ((moment() > startTime) && (moment() < endTime)) {
    // if we are inside of reservation hours
    // then start datepicker at today
    datepickerOptions.min = true;
    // unless 2 hours from now is past endTime, don't allow 
    // any more reservations
    if (moment().add('hours', 2) > endTime) {
      datepickerOptions.min = 1;
    }
  } else {
    // after hours, make datepicker start tomorrow
    datepickerOptions.min = 1;
  }

  this.datepicker = $('.datepicker').pickadate(datepickerOptions);
  this.timepicker = $('.timepicker').pickatime(timepickerOptions);

};

Template.makeReservationForm.destroyed = function () {
  $('.picker', 'body').remove();
  $(this.datepicker).stop();
  this.datepicker = null;
  $(this.timepicker).stop();
  this.timepicker = null;
  
  AutoForm.resetForm(this.data._id);
};


