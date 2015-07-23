Template.transportation.rendered = function() {
  // Convert all the links with the progress-button class to
  // actual buttons with progress meters.
  // You need to call this function once the page is loaded.
  // If you add buttons later, you will need to call the function only for them.
  $('.progress-button').progressInitialize();
};

Template.transportation.events({
  'click #btn-request:not(.in-progress):not(.finished)': function(e, tmpl) {
    e.preventDefault();

    var requestButton = tmpl.$(e.currentTarget);
    requestButton.progressStart();

    var user = Meteor.user();
    var selectedDate = Session.get('selectedDate');
    var selectedMinutes = Session.get('selectedMinutes');
    var reservationMoment = moment(selectedDate).startOf('day').add(selectedMinutes, 'minutes');
    var tip = Session.get('selectedTip');
    var hotelServiceData = this;

    var request = {
      type: hotelServiceData.type,
      serviceId: hotelServiceData._id,
      handledBy: 'hotel',
      date: reservationMoment.toDate(),
      zone: Session.get('zone'),
      options: {
        transportationType: tmpl.$('[name=transportationType]').val(),
      },
      tip: tip
    };

    App.track('Hotel Service Request', {
      "Requested At": new Date(),
      "Request Date": request.date,
      "Hotel Service": "Transportation"
    });

    $(document).one('user-selected', function() {
      $(document).off('user-selected');
      $(document).off('cancel-user-selected');

      var stay = Stays.findOne({users: Meteor.userId(), active: true});

      if (!stay) {
        return Errors.throw('User does not have a valid stay.');
      }

      Meteor.call('requestService', request, stay._id, function(error, result) {
        if (error) {
          requestButton.progressError();

          return Errors.throw('Error Requesting Service');
        }

        requestButton.progressFinish();
        Meteor.setTimeout(function() {
          Router.go('recent-orders');
        }, 500);
      });
    });

    $(document).one('cancel-user-selected', function() {
      $(document).off('user-selected');
      $(document).off('cancel-user-selected');
      requestButton.progressError();
      return;
    });

    if (!Meteor.user()) {
      modal.show('selectUser');
    } else {
      $(document).trigger('user-selected');
    }
  }
});
