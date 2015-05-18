Template.roomServiceSelectTip.onRendered(function() {
  Session.set('selectedTip', 2);
});

Template.roomServiceSelectTip.onDestroyed(function() {
  Session.set('selectedTip', 0);
});

Template.roomServiceSelectTip.events({
  'change #tip': function(e, tmpl) {
    Session.set('selectedTip', parseInt(tmpl.$(e.currentTarget).val()));
  }
});
