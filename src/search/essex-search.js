var EssexSearch = function(options) {
    this.name = options.name;
    this.urlBase = 'https://www.essexapartmenthomes.com/api/get-available';
    this.propID = options.propId;
};

_.extend(EssexSearch.prototype, {
    makeRequest: function(date) {
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
console.log(floorplans)
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
console.log(data);
      return data;
    }
});

module.exports = EssexSearch;
