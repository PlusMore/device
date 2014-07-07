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