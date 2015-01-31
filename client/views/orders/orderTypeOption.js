Template.orderTypeOption.helpers({
	isSelectedOption: function() {
    var orderFilters = Session.get('orderFilters');
    if (!!orderFilters) {
      return !!_.findWhere(orderFilters, {group: this.group, name: this.name}) ? 'active' : '';
    } 
  }
});

Template.orderTypeOption.events({
  'click a': function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var filters = Session.get('orderFilters') || [];

    var filtersForGroup = _.where(filters, {group: this.group});

    var filter = {
      group: this.group,
      name: this.name
    };
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
    Session.set('orderFilters', filters);
  }
});