Template.transportation.events({
  'click #btn-request': function(e, tmpl) {
    e.preventDefault();

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

      Router.go('orders');
    });
  }
});

