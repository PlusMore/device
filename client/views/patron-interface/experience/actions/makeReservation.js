Template.makeReservationCallToAction.events({
  'click .btn': function(e, tmpl) {
    e.preventDefault();
    console.log('make Reservation button clicked');
    mixpanel.track("Started Reservation Process");
    Session.set('experienceState', 'in-progress');
  }
});

Template.makeReservationForm.helpers({
  makeReservationSchema: function () {
    var schema = Schema.makeReservation._schema;
    var _this = this;
    if (this.maxPartySize) {
      schema.partySize.max = this.maxPartySize;
    }
    return new SimpleSchema(schema); 
  }
});

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


