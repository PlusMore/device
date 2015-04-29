Schema.NavCategory = new SimpleSchema({
  name: {
    type: String,
    label: "Category Name"
  },
  menuRank: {
    type: Number,
    label: "Menu Rank",
    allowedValues: [1, 2, 3, 4, 5, 6, 7],
    autoform: {
      options: [{
        label: "1",
        value: 1
      }, {
        label: "2",
        value: 2
      }, {
        label: "3",
        value: 3
      }, {
        label: "4",
        value: 4
      }, {
        label: "5",
        value: 5
      }, {
        label: "6",
        value: 6
      }, {
        label: "7",
        value: 7
      }]
    }
  },
  adminOnly: {
    type: Boolean,
    label: "Admin Only"
  },
  kioskOnly: {
    type: Boolean,
    label: "Kiosk Only"
  },
  mobileOnly: {
    type: Boolean,
    label: "Mobile Only"
  },
  responsiveHelper: {
    type: String,
    label: "Responsive Helper",
    optional: true,
    allowedValues: [
      "hidden-xs",
      "visible-xs",
      "hidden-sm",
      "visible-sm",
      "hidden-md",
      "visible-md",
      "hidden-lg",
      "visible-lg",
    ],
    autoform: {
      options: [{
        label: "hidden-xs",
        value: "hidden-xs"
      }, {
        label: "visible-xs",
        value: "visible-xs"
      }, {
        label: "hidden-sm",
        value: "hidden-sm"
      }, {
        label: "visible-sm",
        value: "visible-sm"
      }, {
        label: "hidden-md",
        value: "hidden-md"
      }, {
        label: "visible-md",
        value: "visible-md"
      }, {
        label: "hidden-lg",
        value: "hidden-lg"
      }, {
        label: "visible-lg",
        value: "visible-lg"
      }]
    }
  },
  requiresHotelData: {
    type: Boolean,
    label: "Requires Hotel Data"
  }
});

NavCategories.attachSchema(Schema.NavCategory);
