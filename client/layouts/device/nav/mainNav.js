Template.mainNav.helpers({
  inStayOrInRoom: function() {
    return !!Session.get('stayId') || !!LocalStore.get('inRoom');
  },
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      var currentPath, pathForName, _ref, _ref1;

      currentPath = (_ref = (_ref1 = Router.current()) !== null ? _ref1.path : void 0) !== null ? _ref : location.pathname;
      pathForName = Router.path(name);

      return currentPath === pathForName;
    });
    return active && 'active' || '';
  },
  categories: function() {
    return Categories.find();
  },
  hotelServicesEnabled: function () {
    var hotelCursor = Hotels.find();
    
    if (hotelCursor.count() > 0) {
      var hotel = Hotels.findOne();
      if (!hotel.hotelServicesEnabled) {
        return false;
      } else {
        var activeHotelServices = HotelServices.find({hotelId: hotel._id, active: true, type: {$ne: 'roomService'}});

        if (activeHotelServices.count() > 0) {
          return true;
        }
      }
    }
  }
});

var handleNav = function(e, tmpl) {
  e.preventDefault();
  e.stopImmediatePropagation();
  console.log(e.type);
  var href = $(e.currentTarget).attr('href');
  if (Iron.Location.get().path === href) {
    Menu.hide();
  } else {
    Router.go(href);
  }
};

var events = {};
events[clickevent + " .outer-nav > a"] = handleNav;

Template.mainNav.events(events);