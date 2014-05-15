/* ---------------------------------------------------- +/

## Items ##

Code related to the items template

/+ ---------------------------------------------------- */
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

Template.experiences.helpers({
  experiences: function() {
    var activeCategory = Session.get('activeCategory');
    return Experiences.find({category: activeCategory}, {sort: {sortOrder: 1}});
  }
});


// Session.set('lastScrollPosition', $('body').scrollTop());
// $('body').scrollTop(0);

// $('body').scrollTop(Session.get('lastScrollPosition'));
