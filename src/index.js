var App = require('AptSearch');
require('style/index.sass')

$(document).ready(function() {
  var app = new App();
  app.fetchEssex('sfo1130', 'Foster\'s Landing');
  app.fetchEssex('581', 'Radius');
  app.fetchTriton();

  $.when.apply($, app.requests()).then(function() {
    app.toggleLoading(false);
    app.createChart($('.chart'));
  }).fail(function(resp, message, error) {
  	console.log(`Request failed: ${message}`);
  	if (error) throw error;
  });

  window.app = app;
});
