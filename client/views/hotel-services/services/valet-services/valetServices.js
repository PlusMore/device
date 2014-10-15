Template.valetServices.rendered = function () {
  // Convert all the links with the progress-button class to
  // actual buttons with progress meters.
  // You need to call this function once the page is loaded.
  // If you add buttons later, you will need to call the function only for them.
  $('.progress-button').progressInitialize();
};

Template.valetServices.events({
  'click #btn-request:not(.in-progress):not(.finished)': function(e, tmpl) {
    e.preventDefault();
    
    var requestButton = tmpl.$(e.currentTarget);
    requestButton.progressStart();

    var user = Meteor.user();
    var selectedDate = Session.get('selectedDate');
    var selectedMinutes = Session.get('selectedMinutes');
    var reservationMoment = moment(selectedDate).startOf('day').add(selectedMinutes, 'minutes');

    var ticketNumber = tmpl.$('[name=ticketNumber]').val() || undefined;

    if (!ticketNumber) {
      requestButton.progressError();
      return Errors.throw('Ticket Number is required');
    }

    
    var request = {
      type: 'valetServices',
      for: 'hotel',
      date: reservationMoment.toDate(),
      zone: Session.get('zone'),
      options: {
        ticketNumber: ticketNumber,
      }
    };

    App.track('Hotel Service Request', {
      "Requested At": new Date(),
      "Request Date": request.date,
      "Hotel Service": "Valet Services"
    });

    Meteor.call('requestService', request, function (error, result) {
      if (error) {
        requestButton.progressError();
        return Errors.throw(error);
      }

      requestButton.progressFinish();
      Meteor.setTimeout(function() {
        Router.go('orders');
      }, 500);
    });
  }
});

