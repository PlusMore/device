var callToActionHelpers = {
  callToActionIsReserve: function() {
    return this.callToAction === "reserve";
  }
};

Template.callToAction.helpers(_.extend(callToActionHelpers, {}));