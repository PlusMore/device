Meteor.startup(function() {
  var hammer = $(document.body).hammer();
  hammer.on('swipe', '.experience', function(e) {
    var experienceState = Deps.nonreactive(function() {
      return Session.get('experienceState');
    });

    if (!experienceState) {
      switch (e.gesture.direction) {
        case 'right':
          var currentExperienceId = Router.current().params._id;
          var currentIndex = ExperiencesForCategory.indexOf(currentExperienceId);
          if (currentIndex  === 0) {
            Router.go('experience', {_id: ExperiencesForCategory[ExperiencesForCategory.length - 1]});
          } else {
            Router.go('experience', {_id: ExperiencesForCategory[currentIndex - 1]});
          }
          break;
        case 'left':
          var currentExperienceId = Router.current().params._id;
          var currentIndex = ExperiencesForCategory.indexOf(currentExperienceId);
          if (currentIndex + 1 === ExperiencesForCategory.length) {
            Router.go('experience', {_id: ExperiencesForCategory[0]});
          } else {
            Router.go('experience', {_id: ExperiencesForCategory[currentIndex + 1]});
          }
          break;
      }
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