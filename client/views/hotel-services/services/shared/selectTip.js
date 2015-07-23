Template.selectTip.onRendered(function() {
  Session.set('selectedTip', 2);
});

Template.selectTip.onDestroyed(function() {
  Session.set('selectedTip', 0);
});

Template.selectTip.events({
  'change #tip': function(e, tmpl) {
    Session.set('selectedTip', parseInt(tmpl.$(e.currentTarget).val()));
  }
});
