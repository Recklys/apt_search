var moment = require('moment');
require('grouped-categories');
var EssexSearch = require('search/essex-search');
var TritonSearch = require('search/triton-search');

var date = new moment().add(30, 'days').format('MM-DD-YYYY');

var AptSearchApp = function() {
  var app = this;
  //Bind date button
  $('.date').val(date).on('change', function() {
    date = this.value;
    app.reset();
  });
};

_.extend(AptSearchApp.prototype, {
    searches: [],
    requests: function() {
      return _.map(this.searches, function(search) { return search.request; });
    },

    fetchTriton: function() {
      var search = new TritonSearch();

      this.searches.push(search);
      search.makeRequest(date);
    },

    fetchEssex: function(propId, name) {
      var search = new EssexSearch({
          name: name,
          propId: propId
      });

      this.searches.push(search);
      search.makeRequest(date);
    },

    createChart: function($container) {
      this.chart = Highcharts.chart($container[0], {
        chart: {
          type: 'column',
          height: 600
        },
        credits: {enabled: false},
        series: [{
          data: _.flatten(_.map(this.searches, function(s) { return s.getData(); }))
        }],
        legend: {enabled: false},
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              formatter: function() {
                return '<b>' + this.y + '</b>';
              }
            },
            tooltips: {enabled: false}
          }
        },
        title: {
          text: 'Today\'s rent prices',
          style: {color: '#3B3B3B', 'font-family': 'Helvetica', 'font-size': '2em'}
        },
        xAxis: {
          categories: _.map(this.searches, function(s) { 
            return {
              name: s.name,
              categories: _.map(s.getFloorplans(), function(fp) { return fp.name + ' (' + fp.sqft_range + ' sq ft)'; })
            } 
          }),
          title: {
            text: 'Floorplans',
            style: {color: '#12175C', 'font-size': '1.5em'}
          }
        },
        yAxis: {
          title: {
            text: 'Price ($)',
            style: {color: 'green', 'font-size': '1.5em'}
          }
        }
      });
    },

    reset: function() {
      if (this.chart) this.chart.destroy();
      _.each(this.searches, function(s) { s.makeRequest(date); });
      this.toggleLoading(true);

      $.when.apply($, this.requests()).then(function() {
        this.toggleLoading(false);
        this.createChart($('.chart'));
      }.bind(this));
    },

    toggleLoading: function(toggle) {
      $('.loading').toggle(toggle);
    }
});

module.exports = AptSearchApp;
