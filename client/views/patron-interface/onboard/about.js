Template.about.events({
  'click .btn-skip': function (e) {
    e.preventDefault();
    App.endTutorial();
  }
});