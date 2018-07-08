var TritonSearch = function(options) {
    this.name = 'The Triton';
    this.urlBase = 'http://www.thetritonfostercity.com/site-plan/';
    this.request = null;
};

_.extend(TritonSearch.prototype, {
    makeRequest: function(date) {
      this.request = $.get(`curl_proxy.php?url=${this.urlBase}`, {}, function(resp) {
        resp = $.parseHTML(resp, document, true);

        this.availability = eval($(resp).find('section#sp + script + script + script').html());
        console.log(this.availability);
      }.bind(this), 'html');

      return this.request;
    },

    getFloorplans: function() {
      var floorplans = [];

      this.availability.forEach(function(item) {
        var found = floorplans.find(function(fp) {
          return fp.name === item.unitPlan;
        });

        if (item.unitPlan.match(/^[12]/) && !found) {
          floorplans.push({
            name: item.unitPlan,
            sqft_range: item.unitSqft
          })
        }
      });

      return floorplans;
    },

    getData: function() {
      var data = this.getFloorplans().map(function(fp) {
        return this.availability.find(function(item) {
          return item.unitPlan === fp.name;
        }).unitCost;
      }.bind(this));

      return data;
    }
});

module.exports = TritonSearch;
