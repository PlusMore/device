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
  tagsFromGroups: function() {
    var results = [];
    var that = this;
    
    _.each(this.tagGroups, function(group) {
      _.each(that[group+'Tags'], function(tag) {
        results.push({
          group: group,
          tag: tag
        });
      });
    });


    return _.uniq(results);
  },
  hasPhotos: function() {
    return PlusMoreAssets.find({
      type: 'experience',
      refId: this._id
    }).count();
  }
});