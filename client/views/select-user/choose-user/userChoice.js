Template.userChoice.events({
  'click .user-choice': function (e, tmpl) {
    Session.set('selectedUserChoice', this._id);

    var parent = tmpl.findParentTemplate('chooseUser');
    parent.$(parent.firstNode).trigger('user-choice-selected');
  }
});