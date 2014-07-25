Template.valetServices.rendered = function () {
  var hotelService = HotelServices.findOne({type: 'valetServices'});
  initializeServicePickers(this, hotelService.startMinutes, hotelService.endMinutes);
};

Template.valetServices.destroyed = function () {
  destroyServicePickers(this);
};

Template.valetServices.events({
  'click #btn-request': function(e, tmpl) {
    e.preventDefault();

    var user = Meteor.user();
    var reservationMoment = moment(tmpl.selectedDate).startOf('day').add('minutes', tmpl.selectedMinutes);

    var request = {
      type: 'valetServices',
      for: 'hotel',
      options: {
        date: reservationMoment.toDate()
      }
      
    }

    App.track('Hotel Service Request', {
      "Requested At": new Date(),
      "Request Date": request.options.date,
      "Hotel Service": "Valet Services"
    });

    Meteor.call('requestService', request, function (error, result) {
      if (error) {
        return Errors.throw(error);
      }

      Router.go('orders');
    });
  }
});

