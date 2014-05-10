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
  
  $(this.$('#' + this.data._id)).find('[name=experienceId]').val(this.data._id);

  var checkoutDate = Stays.findOne().checkoutDate;
  this.datepicker = $('.datepicker').pickadate({
    container: '.overlays',
    min: true,
    max: checkoutDate,
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


