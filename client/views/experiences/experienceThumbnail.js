Template.experienceThumbnail.events({
  'click .experienceThumbnail': function () {
    console.log('clicked experienceThumbnail');
    Session.set('currentExperienceId', this._id);
  }
});