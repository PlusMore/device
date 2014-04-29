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
  formId: function () {
    return this._id;

  }
});

Template.makeReservationForm.rendered = function () {
  var _this = this;
  
  $(this.$('#' + this.data._id)).find('[name=experienceId]').val(this.data._id);

  this.datepicker = $('.datepicker').pickadate({
    container: '.overlays',
    min: true,
    onSet: function(date) {
      if (date.select) {
        var selectedDate = moment(date.select).startOf('day').toDate();
        console.log(selectedDate);

        var $reservationOptionsEl = this.$node.closest('.make-reservation-form')

        $reservationOptionsEl.find('[name=dateDatetime]').val(moment(date.select).startOf('day').format('YYYY-MM-DD'));
      }
    },
    format: 'mmmm d, yyyy'
  });

  var options = {
    container: '.overlays',
    onSet: function(select) {
      var minutes = select.select;
      var $reservationOptionsEl = this.$node.closest('.make-reservation-form')
      $reservationOptionsEl.find('[name=timeMinutes]').val(minutes);
    }
  }

  var startMinutes = this.data.reservationStartMinutes;
  var endMinutes = this.data.reservationEndMinutes;
  var startTime, endTime;

  if (startMinutes) {
    startTime = moment().startOf('day');
    startTime = startTime.minutes(startMinutes);
    options.min = startTime.toDate();
  } else {
    options.min = moment().startOf('day').hours(16).toDate();
  }
  

  if (endMinutes) {
    endTime = moment().startOf('day').minutes(endMinutes).toDate();
    options.max = endTime;
  }

  this.timepicker = $('.timepicker').pickatime(options);

};

Template.makeReservationForm.destroyed = function () {
  $('.picker', '.overlays').remove();
  $(this.datepicker).stop();
  this.datepicker = null;
  $(this.timepicker).stop();
  this.timepicker = null;
  
  AutoForm.resetForm(this.data._id);
};

Handlebars.registerHelper("hourOptions", function() {
  var hours = [1,2,3,4,5,6,7,8,9,10,11,12];
  var hourOptions = [];

  _.each(hours, function(hour) {
    hourOptions.push({
      label: hour,
      value: hour
    });
  });

  return hourOptions;
});

Handlebars.registerHelper("minuteOptions", function() {
  var minutes = ['00', '30'];
  var minuteOptions = [];

  _.each(minutes, function(minute) {
    minuteOptions.push({
      label: minute,
      value: minute
    });
  });

  return minuteOptions;
});

Handlebars.registerHelper("timePeriodOptions", function() {
  var timePeriods;
  var now = new Date();
  var mNow = moment(now);

  var currentTimePeriod = mNow.format('A');
  if (currentTimePeriod === "PM") {
    timePeriods = ['PM', 'AM'];
  } else {
    timePeriods = ['AM', 'PM'];
  }

  var timePeriodOptions = [];

  _.each(timePeriods, function(timePeriod) {
    timePeriodOptions.push({
      label: timePeriod,
      value: timePeriod
    });
  });

  return timePeriodOptions;
});


