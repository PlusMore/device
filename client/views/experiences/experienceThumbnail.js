Template.experienceThumbnail.events({
  'click .experienceThumbnail': function (e, tmpl) {
    // don't open when user just meant to open perspective container
    if (!$(e.currentTarget).closest('.perspective').hasClass('animate')) { 
      Session.set('currentExperienceId', this._id);
    }
  }
});