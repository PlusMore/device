Meteor.startup(function() {
  var hammer = $(document.body).hammer();
  hammer.on('swipeleft', '.experience', function() {
    var currentExperienceId = Router.current().params._id;
    var currentIndex = ExperiencesForCategory.indexOf(currentExperienceId);
    if (currentIndex + 1 === ExperiencesForCategory.length) {
      Router.go('experience', {_id: ExperiencesForCategory[0]});
    } else {
      Router.go('experience', {_id: ExperiencesForCategory[currentIndex + 1]});
    }
  });
  hammer.on('swiperight', '.experience', function() {
    var currentExperienceId = Router.current().params._id;
    var currentIndex = ExperiencesForCategory.indexOf(currentExperienceId);
    if (currentIndex  === 0) {
      nextAnimation = 'back';
      Router.go('experience', {_id: ExperiencesForCategory[ExperiencesForCategory.length - 1]});
    } else {
      nextAnimation = 'back';
      Router.go('experience', {_id: ExperiencesForCategory[currentIndex - 1]});
    }
  });
});

ExperiencesForCategory = []

Meteor.startup(function() {
  Deps.autorun(function() {
    var activeCategory = Session.get('activeCategory');

    if (activeCategory) {
      ExperiencesForCategory = [];
      Experiences.find({category: activeCategory}, {sort: {sortOrder: 1}}).map(function(doc, index, cursor) {
        ExperiencesForCategory.push(doc._id);
        return doc;
      });
    } else {
      ExperiencesForCategory = [];
    }
  });
});