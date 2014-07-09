Package.describe({ summary: "Provides unit tests for PlusMore Device Application." });

Package.on_test(function (api) {
  // add package dependencies
  api.use(["spacebars", "tinytest", "test-helpers"]);

  // in particular, you'll probably want to use the 'templating' package for any UI related tests
  api.use("templating", "client");

  // add stubs
  api.add_files('test-stubs.js', 'client');

  // reference the application files you want to test
  // api.add_files('../../leaderboard.js', 'client');

  // and link to the unit tests for them
  api.add_files('device-tests.js', 'client');
});