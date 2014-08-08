Template.addItemToCartModal.helpers({
  item: function() {
    return MenuItems.findOne(Session.get('addItem'));
  }, 
  isVisibleClass: function() {
    if (!!Session.get('addItem')) {
      return 'show in animated fadeInDown';
    } else {
      return 'hidden';
    }
  }, 
  menuCategoryId: function() {
    return this._id;
  }
});

Template.addItemToCartModal.events({
  'click [data-dismiss="modal"]':function(){
    Session.set('addItem', undefined);
  }
});

AutoForm.hooks({
  newMenuItem: {
    // Called when any operation succeeds, where operation will be
    // "insert", "update", "remove", or the method name.
    onSuccess: function(operation, result, template) {
      console.log('success');
      Session.set('addItem', undefined);
    }, 

    // Called when any operation fails, where operation will be
    // "validation", "insert", "update", "remove", or the method name.
    onError: function(operation, error, template) {
      if (operation !== 'validation') {
        Errors.throw(error.message);
        console.log('error');
      }
    },

    // Called at the beginning and end of submission, respectively.
    // This is the place to disable/enable buttons or the form,
    // show/hide a "Please wait" message, etc. If these hooks are
    // not defined, then by default the submit button is disabled
    // during submission.
    beginSubmit: function(formId, template) {
      // disable button
      // change text to 'submitting'
      console.log('begin submit');
    },
    endSubmit: function(formId, template) {
      // enable button
      console.log('end submit');
    }
  }
});