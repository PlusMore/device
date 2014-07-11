Template.transportation.events({
  'click #btn-request': function(e, tmpl) {
    e.preventDefault();

    var user = Meteor.user();
    var experience = tmpl.data;
    var reservationMoment = moment(tmpl.selectedDate).startOf('day').add('minutes', tmpl.selectedMinutes);

    var request = {
      // What's the request for
      when: reservationMoment.calendar(),
      date: reservationMoment.toDate()
    }

    App.track('Hotel Service Request', {
      "Requested At:": new Date(),
      "Request Date:": reservation.when,
    });
  }
});

Template.transportation.rendered = function () {
  initializeServicePickers(this, 7*60, 22*60);
};

Template.transportation.destroyed = function () {
  destroyServicePickers(this);
};