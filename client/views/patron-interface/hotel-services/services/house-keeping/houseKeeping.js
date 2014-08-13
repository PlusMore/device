Template.houseKeeping.events({
  'click #btn-request': function(e, tmpl) {
    e.preventDefault();

    var user = Meteor.user();
    var selectedDate = Session.get('selectedDate');
    var selectedMinutes = Session.get('selectedMinutes');
    var reservationMoment = moment(selectedDate).startOf('day').add('minutes', selectedMinutes);
    
    var request = {
      type: 'houseKeeping',
      for: 'hotel',
      options: {
        date: reservationMoment.toDate()
      }
      
    };

    App.track('Hotel Service Request', {
      "Requested At": new Date(),
      "Request Date": request.options.date,
      "Hotel Service": "House Keeping"
    });

    Meteor.call('requestService', request, function (error, result) {
      if (error) {
        return Errors.throw(error);
      }

      Router.go('orders');
    });
  }
});

