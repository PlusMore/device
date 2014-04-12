// package.js  

Package.describe({
  // define a message to describe the package
  summary: "Jquery Idle Timer.",
});

Package.on_use(function (api) {
  api.add_files(['idle-timer.js'], 'client');
});