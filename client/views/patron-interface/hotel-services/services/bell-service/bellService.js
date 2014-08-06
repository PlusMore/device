Template.bellService.rendered = function () {
  var hotelService = HotelServices.findOne({type: 'bellService'});
  initializeServicePickers(this, hotelService.startMinutes, hotelService.endMinutes);
};

Template.bellService.destroyed = function () {
  destroyServicePickers(this);
};

Template.bellService.events({
  'click #btn-request': function(e, tmpl) {
    e.preventDefault();

    var user = Meteor.user();
    var reservationMoment = moment(tmpl.selectedDate).startOf('day').add('minutes', tmpl.selectedMinutes);

    var request = {
      type: 'bellService',
      for: 'hotel',
      options: {
        date: reservationMoment.toDate()
      }
      
    }

    App.track('Hotel Service Request', {
      "Requested At": new Date(),
      "Request Date": request.options.date,
      "Hotel Service": "Bell Service"
    });

    Meteor.call('requestService', request, function (error, result) {
      if (error) {
        return Errors.throw(error);
      }

      Router.go('orders');
    });
  }
});

