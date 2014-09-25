Template.howToBook.helpers({
  diningExperience: function () {
    return Experiences.findOne({category: 'Dining'});
  }
});

Template.howToBook.events({
  'click .btn-ready': function (e) {
    e.preventDefault();
    App.endTutorial();
  },
  'click .experienceThumbnail a': function (e) {
    e.preventDefault();
  }
});