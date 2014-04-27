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
  }
});

Template.makeReservationForm.rendered = function () {
  $('.datepicker').pickadate({
    today: false,
    clear: false,
    min: moment({hour: 12, minute: 0}).add('days', 1).toDate(),
    onSet: function(date) {
      if (date.select) {
        var selectedDate = moment(date.select).hour(12).minute(0).second(0).toDate();
        console.log(selectedDate);
        Meteor.call('registerStay', selectedDate, function (error, result) {
          if (error) throw new Meteor.Error(error);
          Router.go('orders');
        });
      }
    }
  });

  $('.timepicker').pickatime({
    min: +1,
    max: [4,0]
  });

};

AutoForm.hooks({
  makeReservation: {
    onSubmit: function (doc) {
      $(this.template.find('.buttons button[type=submit]')).prop('disabled', true).text('Submitting...');
      doc.experienceId = Session.get('currentExperienceId');;
      Meteor.call('makeReservation', doc, function (err, result) {
        if (err) throw new Meteor.Error(500, 'Something went wrong', err);
        Session.set('experienceState', 'complete');
      });
      return false;
    } 
  }
});

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


