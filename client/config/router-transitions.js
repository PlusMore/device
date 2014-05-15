nextAnimation = '';

Router.setTransitionType(function(from, to, type) {
  if (nextAnimation) {
    var animation = nextAnimation;
    nextAnimation = '';
    return animation;
  }

  if (from.template === 'experiences' && to.template === 'experience') {
    return 'up';
  }
  if (from.template === 'experience' && to.template === 'experiences') {
    return 'down';
  }
  return type;
});