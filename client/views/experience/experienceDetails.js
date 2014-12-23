Template.experienceDetails.rendered = function () {
  var currentExperienceId = Session.get('currentExperienceId');
  var experience = Experiences.findOne(currentExperienceId);

  if (experience) {
    App.track("View Experience", {
              "Experience Title": experience.title,
              "Experience Category": experience.category,
              "Experience Lead": experience.lead,
              "Experience PhotoUrl": experience.photoUrl,
              "Experience Id": experience._id,
              "Experience Description": experience.description,
              "City": experience.city
    });
  }
};

Template.experienceDetails.helpers({
  stickBookNow: function() {
    return Session.get('stickBookNow');
  },
  tagsFromGroups: function() {
    var results = [];
    var that = this;
    
    _.each(this.tagGroups, function(group) {
      results = results.concat(that[group+'Tags']);
    });


    return _.uniq(results);
  }
});