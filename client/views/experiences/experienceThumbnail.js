Template.experienceThumbnail.events({
  // 'click .experienceThumbnail': showExperience,
  // 'touchstart .experienceThumbnail': showExperience,
  'click .experienceThumbnail': function(e, tmpl) {
    if ( !  ($(e.currentTarget).closest('.perspective').hasClass('animate'))   ||   ($(e.currentTarget).closest('.main').hasClass('dropdown-open'))    ) { 
      Session.set('currentExperienceId', this._id);
    }
  }
});

