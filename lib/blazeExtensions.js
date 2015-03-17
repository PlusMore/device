Meteor.startup(function() {
  _.extend(Blaze.TemplateInstance.prototype, {
    findParentTemplate: function(templateName) {
      if (!/^Template\./.test(templateName))
        templateName = 'Template.' + templateName;
      var view = this.view;
      while (view.name !== templateName) {
        view = view.parentView;
        if (!view)
          return null;
      }
      return view.templateInstance();
    }
  });
});
