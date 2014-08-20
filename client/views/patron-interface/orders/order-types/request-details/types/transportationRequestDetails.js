Template.transportationRequestDetails.helpers({
  transportationType: function () {
    switch (this.request.options.transportationType) {
      case 'taxi': 
        return 'Taxi';
      case 'limo': 
        return 'Limo';
    }
  }
});