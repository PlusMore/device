Template.transportation.rendered = function () {
  // Convert all the links with the progress-button class to
  // actual buttons with progress meters.
  // You need to call this function once the page is loaded.
  // If you add buttons later, you will need to call the function only for them.
  $('.progress-button').progressInitialize();
};

Template.transportation.events({
  'click #btn-request': function(e, tmpl) {
    e.preventDefault();
    
    var requestButton = tmpl.$(e.currentTarget);
    requestButton.progressStart();

    var user = Meteor.user();
    var selectedDate = Session.get('selectedDate');
    var selectedMinutes = Session.get('selectedMinutes');
    var reservationMoment = moment(selectedDate).startOf('day').add('minutes', selectedMinutes);
    
    var request = {
      type: 'transportation',
      for: 'hotel',
      options: {
        transportationType: tmpl.$('[name=transportationType]').val(),
        date: reservationMoment.toDate()
      }
      
    };

    App.track('Hotel Service Request', {
      "Requested At": new Date(),
      "Request Date": request.options.date,
      "Hotel Service": "Transportation"
    });

    Meteor.call('requestService', request, function (error, result) {
      if (error) {
        return Errors.throw(error);
      }

      requestButton.progressFinish();
      Meteor.setTimeout(function() {
        Router.go('orders');
      }, 500);
    });
  }
});

