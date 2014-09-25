Template.experience.helpers({
  subscriptionsReady: function() {
    if (subscriptions && (subscriptions.stayInfo  && typeof subscriptions.stayInfo !== 'undefined') && (subscriptions.deviceData && typeof subscriptions.deviceData !== 'undefined')) {
      return subscriptions.stayInfo.ready() && subscriptions.deviceData.ready();
    }
  }
});