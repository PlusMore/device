Template.experienceFilterOption.helpers({
  isSelectedOption: function() {
    var experienceFilters = Session.get('experienceFilters');
    if (!!experienceFilters) {
      return !!_.findWhere(experienceFilters, {group: this.group, name: this.name}) ? 'active' : '';
    } 
  }
});   

Template.experienceFilterOption.events({
  'click a': function (e) {
    e.preventDefault();

    var filters = Session.get('experienceFilters') || [];

    var filter = {
      group: this.group,
      name: this.name
    }
    // if the filter is active, remove it
    if (_.findWhere(filters, filter)) {
      filters = _.filter(filters, function(item) { 
        return !(item.group === filter.group && item.name === filter.name);
      });
    }
    else {
      filters.push({group: this.group, name: this.name});
    }

    // Produce a duplicate-free version of the array
    filters = _.uniq(filters);
    Session.set('experienceFilters', filters);
  }
});