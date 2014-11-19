Template.accountsDropdown.helpers({
  dropdownText: function () {
    var deviceId = LocalStore.get('deviceId');

    if (deviceId) {
      var device = Devices.findOne(deviceId);
      if (device)
        return device.location;
    } else {
      return 'Sign in';
    }
  }
});