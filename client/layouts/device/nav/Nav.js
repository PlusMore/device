var enabledText = function(enabled) {
  return enabled ? 'Pass' : 'Fail';
};

Nav = {
  checkPermissions: function(nav) {
    var user = Meteor.user();
    var kiosk = LocalStore.get('kiosk');
    var hotel = Hotels.findOne();
    var enabled = true;

    // This code could be better, but let enabled fall through everything to
    // support multiple checkboxes, if a check fails immediately exit

    if (nav.adminOnly) {
      enabled = Roles.userIsInRole(Meteor.user(), ['admin']);
      console.log("{0} is admin only - {1}".format(nav.name, enabledText(enabled)));
      if (!enabled) return false;
    }

    if (nav.kioskOnly) {
      enabled = !!kiosk;
      console.log("{0} is kiosk only - {1}".format(nav.name, enabledText(enabled)));
      if (!enabled) return false;
    }

    if (nav.mobileOnly) {
      enabled = !kiosk;
      console.log("{0} is mobile only - {1}".format(nav.name, enabledText(enabled)));
      if (!enabled) return false;
    }

    if (nav.hotelService) {
      enabled = !!hotel && hotel.hotelServicesEnabled;
      console.log("{0} is a hotel service - {1}".format(nav.name, enabledText(enabled)));

      if (enabled) {

        // if roomService, check that room service is enabled by the hotel
        if (nav.routeName === 'roomService') {
          var roomService = HotelServices.findOne({type: 'roomService'});
          enabled = !!(roomService && roomService.active);
        }

        // check that there are hotel services active
        if (nav.routeName === 'hotelServices') {
          var hotelServices = HotelServices.find({active: true, type: {$ne: 'roomService'}});
          enabled = !!(hotelServices.count() > 0);
        }

      }

      if (!enabled) return false;
    }

    if (nav.requiresHotelData) {
      enabled = !!hotel;
      console.log("{0} requires hotel data - {1}".format(nav.name, enabledText(enabled)));
      if (!enabled) return false;
    }

    if (nav.responsiveHelper) {
      enabled = Nav.checkSizeRequirements(nav.responsiveHelper);
      console.log("{0} has responsive helper - {1}".format(nav.name, nav.responsiveHelper));
      if (!enabled) return false;
    }

    return enabled;
  },
  checkSizeRequirements: function(responsiveHelper) {
    switch (responsiveHelper) {
      case 'visible-xs':
        return ResponsiveHelpers.isXs();
        break;
      case 'hidden-xs':
        return !ResponsiveHelpers.isXs();
        break;
      case 'visible-sm':
        return ResponsiveHelpers.isXs();
        break;
      case 'hidden-sm':
        return !ResponsiveHelpers.isXs();
        break;
      case 'visible-md':
        return ResponsiveHelpers.isXs();
        break;
      case 'hidden-md':
        return !ResponsiveHelpers.isXs();
        break;
      case 'visible-lg':
        return ResponsiveHelpers.isXs();
        break;
      case 'hidden-lg':
        return !ResponsiveHelpers.isXs();
        break;
      default:
        return true;
    }
  }
};
