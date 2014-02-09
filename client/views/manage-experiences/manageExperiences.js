Template.uploadExperiencePhoto.events({
  'change .experiencePhotoUploader': function(e) {
    var userId = Meteor.userId();
    var files = e.target.files,
        meta = {
          owner: userId
        },
        result = [];

    if (files.length) {
      for (var i = 0, f; f = files[i]; i++) {
        var photoId = ExperiencesFS.storeFile(f, meta)
        result.pop(photoId);

        var photo = ExperiencesFS.findOne(photoId);

        Meteor.call('insertEvent', {
          name: 'experience photo uploaded',
          type: 'application',
          userId: userId,
          payload: photo,
          message: "Photo {0} uploaded by {1}".format(photoId, userId)
        });
      }
    }
    return result;
  }
});

Template.uploadedPhotos.helpers({
  photos: function() {
    var query = {
      'metadata.createSession': Session.get('createExperienceSessionId')
    }
    return ExperiencesFS.find({'metadata.owner': Meteor.userId()});
  }
});

Template.myExperiences.helpers({
  experiences: function() {
    return Experiences.find({owner: Meteor.userId()});
  }
});

Template.editExperience.helpers({
  experienceSchema: function() {
    var experiencesForm = new AutoForm(Experiences);
    return experiencesForm;
  }
});

Handlebars.registerHelper("categoryOptions", function() {
  var categories = Categories.find().fetch();
  var categoryOptions = [];

  _.each(categories, function(category) {
    categoryOptions.push({
      label: category.name,
      value: category.name
    });
  });

  return categoryOptions;
});