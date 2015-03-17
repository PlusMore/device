Handlebars.registerHelper('currency', function(num) {
  num = num || 0;
  return '$' + Number(num).toFixed(2);
});
