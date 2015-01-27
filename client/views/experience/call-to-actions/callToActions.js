var callToActionHelpers = {
  callToActionTemplate: function() {
    return this.callToAction === "reserve" ? 'bookNow' : '';
  }
};

Template.callToAction.helpers(_.extend(callToActionHelpers, {}));