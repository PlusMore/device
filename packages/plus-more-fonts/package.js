Package.describe({
  summary: "Plus more fonts, Lato and icons"
});

Package.on_use(function (api) {
  api.use(['less'], 'client');

  // icons
  api.add_files([
    'plus-more-icons/plus-more-icons.eot',
    'plus-more-icons/plus-more-icons.woff',
    'plus-more-icons/plus-more-icons.ttf',
    'plus-more-icons/plus-more-icons.svg'
  ], "client", {isAsset: true});

  api.add_files([
    'plus-more-icons/plus-more-icons.less'
  ], 'client')
});