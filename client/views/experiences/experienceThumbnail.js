Template.experienceThumbnail.events({
  'click .experienceThumbnail': function (e, tmpl) {
    console.log('click experienceThumbnail');
    // don't open when user just meant to open perspective container
    if (!$(e.currentTarget).closest('.perspective').hasClass('modalview')) { 
      Session.set('currentExperienceId', this._id);
      modal.show('experience');
    }
  }
});