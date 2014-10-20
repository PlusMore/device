// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.plusmoretablets.device',
  name: 'PlusMore',
  description: 'Get über power in one button click',
  author: 'PlusMore Team',
  email: 'info@plusmoretablets.com',
  website: 'http://plusmoretablets.com'
});

App.icons({
  // iOS
  'iphone': 'resources/icons/icon-57px.png',
  'iphone_2x': 'resources/icons/icon-57px@2x.png',
  'ipad': 'resources/icons/icon-72px.png',
  'ipad_2x': 'resources/icons/icon-72px@2x.png',

  // Android - XXX these are the same as iOS for now
  'android_ldpi': 'resources/icons/icon-36px.png',
  'android_mdpi': 'resources/icons/icon-48px.png',
  'android_hdpi': 'resources/icons/icon-72px.png',
  'android_xhdpi': 'resources/icons/icon-48px@2x.png'
});

App.launchScreens({
  // iOS
  'iphone': 'resources/splash/ios/320x480.png',
  'iphone_2x': 'resources/splash/ios/320x480@2x.png',
  'iphone5': 'resources/splash/ios/640x1136.png',

  'iphone6': 'resources/splash/ios/750x1334.png',
  'iphone6p_portrait': 'resources/splash/ios/1242x2208.png',
  'iphone6p_landscape': 'resources/splash/ios/2208x1242.png',

  'ipad_portrait': 'resources/splash/ios/768x1024.png',
  'ipad_portrait_2x': 'resources/splash/ios/768x1024@2x.png',

  'ipad_landscape': 'resources/splash/ios/1024x768.png',
  'ipad_landscape_2x': 'resources/splash/ios/1024x768@2x.png',

  // Android
  'android_mdpi_portrait': 'resources/splash/android/mdpi/960x640.9.png',
  'android_mdpi_landscape': 'resources/splash/android/mdpi/960x640.9.png',
  'android_hdpi_portrait': 'resources/splash/android/hdpi/960x640.9.png',
  'android_hdpi_landscape': 'resources/splash/android/hdpi/960x640.9.png',
  'android_xhdpi_portrait': 'resources/splash/android/xhdpi/960x640.9.png',
  'android_xhdpi_landscape': 'resources/splash/android/xhdpi/960x640.9.png'
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#000000');


