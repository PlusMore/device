function supportsTouch() {
  var bool;
  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    bool = true;
  } else {
    bool = false;
    // var query = ['@media (',prefixes.join('touch-enabled),('),'heartz',')','{#modernizr{top:9px;position:absolute}}'].join('');
    // testStyles(query, function( node ) {
    //   bool = node.offsetTop === 9;
    // });
  }
  return bool;
}

clickevent = supportsTouch() ? 'touchstart' : 'click';
Session.set('clickevent', clickevent);
