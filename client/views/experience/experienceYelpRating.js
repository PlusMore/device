Template.experienceYelpRating.rendered = function() {
  Session.set('hasYelp', true);
  var that = this;
  YelpAPI.business(this.data.yelpId, function(err, result) {

    if (err) {
      Errors.throw(err);

      return Session.set('hasYelp', false);
    }

    if (result) {
      if (result.rating < 3) {
        Session.set('hasYelp', false);
      }
      var starSrc = result.rating_img_url_large;
      starSrc = starSrc.replace('http://', 'https://');
      Session.set('yelpStarsSrc', starSrc);
      Session.set('yelpReviewCount', result.review_count);

      var yelpUrl = result.mobile_url;
      yelpUrl = yelpUrl.replace('http://', 'https://');
      Session.set('yelpUrl', yelpUrl);
    }

  });
};

Template.experienceYelpRating.destroyed = function() {
  Session.set('yelpStarsSrc', null);
  Session.set('yelpReviewCount', 'Loading Yelp');
  Session.set('hasYelp', true);
};

Template.experienceYelpRating.helpers({
  yelpStarsSrc: function() {
    return Session.get('yelpStarsSrc');
  },
  yelpReviewCount: function() {
    return Session.get('yelpReviewCount');
  },
  hasYelp: function() {
    return Session.get('hasYelp');
  },
  yelpUrl: function() {
    return Session.get('yelpUrl');
  }
});
