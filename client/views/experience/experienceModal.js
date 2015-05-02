experienceModal = new Modal();

Template.experienceModal.created = function() {
  experienceModal.modalTemp = this;
};

Template.experienceModal.rendered = function() {
  experienceModal.inserted = true;
};

Template.experienceModal.destroyed = function() {
  experienceModal.inserted = false;
};

Template.experienceModal.helpers({
  dynamicTemp: function() {
    return experienceModal.template();
  },
  dynamicData: function() {
    return experienceModal.data();
  },
  isBackdropVisibleClass: function() {
    if (!!experienceModal.template()) {

      if (experienceModal.hiding()) {
        return 'show in animated fadeOut';
      }
      return 'show in animated fadeIn';
    } else {
      return 'hidden';
    }
  },
  isVisibleClass: function() {
    if (!!experienceModal.template()) {

      if (experienceModal.hiding()) {
        return 'show in animated fast fadeOut';
      }
      return 'show in animated fast fadeIn';
    } else {
      return 'hidden';
    }
  }
});

Template.experienceModal.events({
  'click [data-dismiss=modal]': function() {
    experienceModal.close();
  }
});
