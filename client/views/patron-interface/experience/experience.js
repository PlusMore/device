Template.experience.helpers({
  subscriptionsReady: function() {
    return subscriptions.stayInfo.ready() && subscriptions.deviceData.ready();
  }
});