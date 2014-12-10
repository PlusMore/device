Template.newGuest.events({
  'click .new-guest': function (e, tmpl) {
    var parent = tmpl.findParentTemplate('chooseUser');
    parent.$(parent.firstNode).trigger('new-guest-selected');
  }
});