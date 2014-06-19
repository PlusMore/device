Template.experience.helpers({
  subscriptionsReady: function() {
    if (subscriptions && typeof subscriptions.stayInfo !== 'undefined' && typeof subscriptions.deviceData !== 'undefined') {
      return subscriptions.stayInfo.ready() && subscriptions.deviceData.ready();
    }
  }
});