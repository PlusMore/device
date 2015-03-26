Template.experiencesSubnav.helpers({
  groupOrSelectedOption: function() {
    var filters = Session.get('experienceFilters');
    var selectedFromGroup = _.where(filters, {
      group: this.group
    });
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
      var experiencesForCategory = Experiences.find({
        categoryId: this.category._id
      });

      _.each(this.category.filterGroupTags, function(group) {

        var groupOptions = [];
        experiencesForCategory.forEach(function(experience) {
          var tagGroupKey = group + "Tags";
          if (experience[tagGroupKey] && experience[tagGroupKey].length > 0) {
            _.each(experience[tagGroupKey], function(groupOption) {
              var option = _.findWhere(groupOptions, {
                name: groupOption
              });
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
          options: groupOptions
        });
      });
    }

    return results;
  },
  animationClass: function() {
    var width = $(document).width();
    if (width >= 768) {
      return "fadeInDown";
    } else {
      return "fadeInUpBig";
    }
  },
  dropdownStyle: function() {
    var width = $(document).width();
    var maxHeight = parseInt(Session.get('dropdownMaxHeight'), 10);
    var css = "";

    if (width >= 768) {
      css = !!maxHeight ? "max-height: " + maxHeight + "px" : 'height: auto';
      return css;
    } else {
      css = !!maxHeight ? "height: " + maxHeight + "px" : 'height: auto';
      return css;
    }
  }
});

Template.experiencesSubnav.events({
  'shown.bs.dropdown': function(e, tmpl) {
    var mainHeight = $('.main').height();
    Session.set('dropdownMaxHeight', mainHeight);
    $('.main').addClass('dropdown-open');

    Meteor.setTimeout(function() {
      var width = $(document).width();
      var mainHeight = Session.get('dropdownMaxHeight', mainHeight);
      var $dropdownMenu = tmpl.$(e.currentTarget).find('.dropdown-menu:first');

      var $dropdownContainer = $dropdownMenu.parents('.dropdown:first');

      // $dropdownMenu.detach().appendTo('.navbar-plusmore-subnav');

      var $optionsList = $dropdownMenu.find('.options-list');
      var $menuOptions = $dropdownMenu.find('.dropdown-menu-options');

      //clear previously calculated values and classes
      $optionsList.removeClass('scrollable');
      $optionsList.height('auto');

      if (width >= 768) {


        // closest guess
        if ($dropdownMenu[0].scrollHeight > $dropdownMenu[0].offsetHeight) {
          $optionsList.addClass('scrollable');
          $optionsList.height($dropdownMenu[0].offsetHeight - $menuOptions[0].offsetHeight);
        }

        // shrink until perfect
        while ($dropdownMenu[0].scrollHeight > $dropdownMenu[0].offsetHeight) {
          var currentHeight = $optionsList.height();
          $optionsList.height(currentHeight - 1);
        }

      } else {
        var optionsListEl = $optionsList[0];

        if (optionsListEl.scrollHeight > optionsListEl.offsetHeight) {
          $optionsList.addClass('scrollable');
        }
      }
    }, 1);


  },
  'hidden.bs.dropdown': function(e) {
    $('.main').removeClass('dropdown-open');
  },
  // click 'Done'
  'click .dropdown-menu-options > .btn-js-done': function(e, tmpl) {
    console.log('done');
    e.preventDefault();
    e.stopImmediatePropagation();

    var $dropdownMenu = tmpl.$(e.currentTarget).parents('.dropdown').find('.dropdown-toggle').dropdown('toggle');
  },
  'click .dropdown-menu-options > .btn-js-reset': function(e) {
    console.log('reset');
    e.preventDefault();
    e.stopImmediatePropagation();


    var filters = Session.get('experienceFilters') || [];
    var filterGroup = this.group;

    // remove filters for this group
    filters = _.reject(filters, function(filter) {
      return filter.group === filterGroup;
    });

    // Produce a duplicate-free version of the array
    filters = _.uniq(filters);
    Session.set('experienceFilters', filters);

  },
  // clicking options bar shouldn't close menu
  'click .dropdown-menu-options': function(e) {
    console.log('click menu options');
    e.preventDefault();
    e.stopImmediatePropagation();
  }
});
