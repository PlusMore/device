Template.experiencesSubnav.helpers({
  categoryFilterGroupTags: function() {
    var results = [];
    if (this.category && this.category.filterGroupTags && this.category.filterGroupTags.length > 0) {
      var experiencesForCategory = Experiences.find({categoryId: this.category._id});

      _.each(this.category.filterGroupTags, function(group) {
        
        var groupOptions = [];
        experiencesForCategory.forEach(function(experience) {
          var tagGroupKey = group+"Tags";
          if (experience[tagGroupKey] && experience[tagGroupKey].length > 0) {
            _.each(experience[tagGroupKey], function (groupOption) {
              var option = _.findWhere(groupOptions, {name: groupOption});
              if (option) {
                option.count = option.count + 1;
              } else {
                groupOptions.push({
                  name: groupOption,
                  count: 1
                });
              }
            });
          }
          
        });

        results.push({
          group: group,
          options : groupOptions
        });
      });  
    }

    return results;
  }
});