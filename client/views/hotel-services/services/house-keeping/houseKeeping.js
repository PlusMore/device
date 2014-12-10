Template.houseKeeping.rendered = function () {
  // Convert all the links with the progress-button class to
  // actual buttons with progress meters.
  // You need to call this function once the page is loaded.
  // If you add buttons later, you will need to call the function only for them.
  $('.progress-button').progressInitialize();
};

Template.houseKeeping.events({
  'click #btn-request:not(.in-progress):not(.finished)': function(e, tmpl) {
    e.preventDefault();
    
    var requestButton = tmpl.$(e.currentTarget);
    requestButton.progressStart();

    var user = Meteor.user();
    var selectedDate = Session.get('selectedDate');
    var selectedMinutes = Session.get('selectedMinutes');
    var reservationMoment = moment(selectedDate).startOf('day').add(selectedMinutes, 'minutes');
    
    var request = {
      type: 'houseKeeping',
      for: 'hotel',
      date: reservationMoment.toDate(),
      zone: Session.get('zone')
    };

    App.track('Hotel Service Request', {
      "Requested At": new Date(),
      "Request Date": request.date,
      "Hotel Service": "House Keeping"
    });

    $(document).one('user-selected', function() {
      $(document).off('user-selected');
      $(document).off('cancel-user-selected');
      
      Meteor.call('requestService', request, function (error, result) {
        if (error) {
          requestButton.progressError();

          return Errors.throw('Error Requesting Service');
        }

        requestButton.progressFinish();
        Meteor.setTimeout(function() {
          Router.go('orders');
        }, 500);
      });
    });

    $(document).one('cancel-user-selected', function() {
      $(document).off('user-selected');
      $(document).off('cancel-user-selected');
      requestButton.progressError();
      return Errors.throw('Please log in to use this feature.');
    });

    if (!Meteor.user()) {
      Session.set('selectUser', true);
    } else {
      console.log('has user - trigger user-selected');
      $(document).trigger('user-selected');
    }

  }
});