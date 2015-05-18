modal = new Modal();

Template.modal.created = function() {
  modal.modalTemp = this;
}

Template.modal.rendered = function() {
  modal.inserted = true;
}

Template.modal.destroyed = function() {
  modal.inserted = false;
}

Template.modal.helpers({
  dynamicTemp: function() {
    return modal.template();
  },
  dynamicData: function() {
    return modal.data();
  },
  isVisibleClass: function() {
    if (!!modal.template()) {

      if (modal.hiding()) {
        return 'show in animated fadeOut';
      }
      return 'show in animated fadeIn';
    } else {
      return 'hidden';
    }
  }
});

Template.modal.events({
  'click [data-dismiss=modal]': function() {
    modal.close();
  }
});
