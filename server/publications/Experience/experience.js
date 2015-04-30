Meteor.publish('experience', function(experienceId) {
  return [
    Experiences.find(experienceId),
    PlusMoreAssets.find({
      type: 'experience',
      refId: experienceId
    })
  ];
});
