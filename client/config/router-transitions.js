Router.setTransitionType(function(from, to, type) {
  if (from.template === 'experiences' && to.template === 'experience') {
    return 'up';
  }
  if (from.template === 'experience' && to.template === 'experiences') {
    return 'down';
  }
  return type;
});