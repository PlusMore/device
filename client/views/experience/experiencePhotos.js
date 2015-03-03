Template.experiencePhotos.helpers({
  photos: function() {
    return PlusMoreAssets.find({
      type: 'experience',
      refId: this._id
    });
  }
});

Template.experiencePhotos.events({
  'click #experience-photos': function(e, tmpl) {
    e.preventDefault();

    var target = e.target || e.srcElement,
      link = target.src ? target.parentNode : target,
      options = {
        index: link,
        event: e
      },
      links = tmpl.$('a');

    blueimp.Gallery(links, options);
  }
});
