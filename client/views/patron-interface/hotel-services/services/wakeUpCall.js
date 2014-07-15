Template.wakeUpCall.rendered = function () {
  initializeServicePickers(this);
};

Template.wakeUpCall.destroyed = function () {
  destroyServicePickers(this);
};

Template.wakeUpCall.events({
  'click #btn-request': function(e, tmpl) {
    e.preventDefault();

    var user = Meteor.user();
    var reservationMoment = moment(tmpl.selectedDate).startOf('day').add('minutes', tmpl.selectedMinutes);

    var request = {
      type: 'wakeUpCall',
      for: 'hotel',
      options: {
        date: reservationMoment.toDate()
      }
      
    }

    App.track('Hotel Service Request', {
      "Requested At": new Date(),
      "Request Date": request.options.date,
      "Hotel Service": "Wake Up Call"
    });

    Meteor.call('requestService', request, function (error, result) {
      if (error) {
        return Errors.throw(error);
      }

      Router.go('orders');
    });
  }
});

