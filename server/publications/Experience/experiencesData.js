Meteor.publish('experiencesData', function(categoryId, stateCode) {
  var experienceFields = {
    active: 1,
    category: 1,
    lead: 1,
    photoUrl: 1,
    title: 1
  };

  var experiencePublishFields = {
    active: 1,
    categoryId: 1,
    geo: 1,
    lead: 1,
    photoUrl: 1,
    sortOrder: 1,
    tagGroups: 1,
    title: 1,
    yelpId: 1,
    phone: 1
  };

  var tagGroups = Meteor.tags.find({
    group: {
      $exists: true
    }
  });
  var tagGroupsArray = [];
  tagGroups.forEach(function(tag) {
    if (tag.group && tagGroupsArray.indexOf(tag.group) === -1) {
      tagGroupsArray.push(tag.group);
    }
  });

  _.each(tagGroupsArray, function(tagGroup) {
    if (tagGroup !== 'filterGroup') {
      experiencePublishFields[tagGroup + 'Tags'] = 1;
    }
  });

  return [
    Categories.find({
      active: true
    }),
    Experiences.find({
      active: true,
      categoryId: categoryId,
      "geo.stateCode": stateCode
    }, {
      fields: experiencePublishFields
    })
  ];
});

Meteor.startup(function() {
  Experiences._ensureIndex({categoryId: 1});
});
