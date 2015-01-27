Template.experienceThumbnail.events({
  'click .experienceThumbnail': function (e, tmpl) {
    // don't open when user just meant to open perspective container
    if (!$(e.currentTarget).closest('.perspective').hasClass('modalview')) { 
      Session.set('currentExperienceId', this._id);
      experienceModal.show('experience');
    }
  }
});

Meteor.startup(function() {
  Tracker.autorun(function() {
    debugger;
    var expId = Session.get('currentExperienceId');
    if (!!expId && !experienceModal.open()) {
      Meteor.setTimeout(function() {
        experienceModal.show('experience');
      },0)
    }
  });  
});
