nextAnimation = '';
setupAnimation = '';

Router.setTransitionType(function(from, to, type) {
  if (from.template === 'enterCheckoutDate') {
    if (setupAnimation) {
      return setupAnimation;
    }
  }

  if (nextAnimation) {
    var animation = nextAnimation;
    nextAnimation = '';
    return animation;
  }

  if (from.template === 'experience') {
    return 'fade';
  }
  return type;
});