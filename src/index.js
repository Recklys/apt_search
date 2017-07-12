var App = require('AptSearch');
require('style/index.sass')

$(document).ready(function() {
    var app = new App();
    app.fetchEssex('sfo1130', 'Foster\'s Landing');
    app.fetchEssex('sfo1267', 'Lawrence Station');
    app.fetchEssex('sfo1138', 'Lakeshore Landing');
    app.fetchEssex('581', 'Radius');

    $.when.apply($, app.requests()).then(function() {
        app.toggleLoading(false);
        app.createChart($('.chart'));
    });
});
