Template.experiencesSubnav.helpers({
  groupOrSelectedOption: function() {
    var filters = Session.get('experienceFilters');
    var selectedFromGroup = _.where(filters, {group: this.group});
    if (selectedFromGroup && selectedFromGroup.length > 0) {
      return selectedFromGroup.length > 1 ? this.group + ' (' + selectedFromGroup.length + ' Selected)' : selectedFromGroup[0].name;
    } 
    return this.group;
  },
  sortedOptions: function() {
    // debugger;
    return _.sortBy(this.options, function(option) {
      return option.name;
    });
  },
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
                  group: group,
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
  },
  dropdownMaxHeight: function() {
    var dropdownMaxHeight = parseInt(Session.get('dropdownMaxHeight'),10);
    var css = !!dropdownMaxHeight ? "max-height: " + dropdownMaxHeight + "px" : 'height: auto';
    return css;
  }
});

Template.experiencesSubnav.rendered = function () {
  var mainHeight = $('.main').height();
  Session.set('dropdownMaxHeight', mainHeight);

  var that = this;

  Meteor.setTimeout(function() {
    that.$('.dropdown-menu').each(function() { 
      var parent = $(this).parent();
      var clone = $(this).clone();
      $(parent).append(clone);
      clone.removeAttr('style');
      var heightOfMenu = clone.height();
      clone.remove();
      console.log(heightOfMenu);
      if (heightOfMenu > mainHeight) {
        $(this).addClass('scrollable');
      } 
    });
  }, 1000);
};

Template.experiencesSubnav.events({
  'show.bs.dropdown': function (e) {

    $('.main').addClass('dropdown-open');
  },
  'hidden.bs.dropdown': function (e) {
    // debugger;
    $('.experienceThumbnail').on('click', function() {
      console.log('uhhh');
    });
    $('.main').removeClass('dropdown-open');


  }
});