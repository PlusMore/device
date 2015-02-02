Template.transportationServiceDetails.helpers({
  transportationType: function () {
    switch (this.service.options.transportationType) {
      case 'taxi': 
        return 'Taxi';
      case 'limo': 
        return 'Limo';
    }
  }
});