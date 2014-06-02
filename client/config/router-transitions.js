nextAnimation = '';
previousAnimation = '';

Router.setTransitionType(function(from, to, animationType) {
  if (nextAnimation) {
    animationType = nextAnimation;
    nextAnimation = '';
  }

  if (from.template === 'experience') {
    animationType = 'fade';
  }
  previousAnimation = animationType;
  return animationType;
});