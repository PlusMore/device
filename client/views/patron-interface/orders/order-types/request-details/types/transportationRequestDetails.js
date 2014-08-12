Template.transportationRequestDetails.helpers({
  transportationType: function () {
    switch (this.request.options.transportationType) {
      case 'taxi': 
        return 'Taxi';
        break;
      case 'limo': 
        return 'Limo';
        break;
    }
  }
});