Router.setTransitionType(function(from, to, type) {

  if (from.template === 'experience' && to.template === 'experiences') {
    return 'back';
  }
  return type;
});