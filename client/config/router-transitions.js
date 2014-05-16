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

  if (from.template === 'experiences' && to.template === 'experience') {
    return 'up';
  }
  if (from.template === 'experience' && to.template === 'experiences') {
    return 'fade';
  }
  return type;
});