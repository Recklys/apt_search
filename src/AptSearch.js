var moment = require('moment');
require('grouped-categories');

var date = new moment().add(30, 'days').format('MM-DD-YYYY');

var urlBases = {
    'Essex': 'http://www.essexapartmenthomes.com/api/get-available'
};

var AptSearch = function(options) {
    this.name = options.name;
    this.urlBase = urlBases[options.type];
    this.propID = options.propId;
};

_.extend(AptSearch.prototype, {

    makeRequest: function() {
        this.request = $.getJSON('curl_proxy.php', {url: [this.urlBase, this.propID, date].join('/')});
        return this.request;
    },

    getFloorplans: function() {
        var floorplans = [];

        _.each(_.filter(this.request.responseJSON, function(resp) {
              return resp.bed_bath.match(/1|1.5|2 Bed/i);
        }), function(floorPlanType) {

            _.each(floorPlanType.floorplans, function(fp) { 
                if (fp.rent_range.trim() !== '') floorplans.push(fp); 
            })
        });

        return floorplans;
    },

    getData: function() {
        var data = [];

        _.each(this.getFloorplans(), function(floorPlan) {
            var price = floorPlan.rent_range;
            if (price.trim() !== '') {
                  if (price.match(/&ndash;/)) price = price.split('&ndash;')[0];
                    data.push(parseInt(price.replace('$', '')));
            }

        });

        return data;
    }
});

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

    fetchBRE: function(propId, name) {
        var search = new AptSearch({
            type: 'BRE', 
            name: name, 
            propId: propId
        });

        this.searches.push(search);
        search.makeRequest();
        return search;
    },

    fetchEssex: function(propId, name) {
        var search = new AptSearch({
            type: 'Essex', 
            name: name, 
            propId: propId
        });

        this.searches.push(search);
        search.makeRequest();
        return search;
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
        this.chart.destroy();
        _.each(this.searches, function(s) { s.makeRequest(); });
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
