var CategoryCount = Backbone.Model.extend({
	defaults: {
		months: [],
		categories: [],
		countByMonth: {},
		maxCount: 0
	},

	initialize: function(attributes) {
		_.bindAll(this);

        this.determineCategories(attributes.data);
        this.calcCountByMonth(attributes.data, attributes.months);
	},

	// figure out list of distinct category names
	determineCategories: function(dataset){
        this.set("categories", dataset.groupBy("Category", ["Count"]).column("Category").data);
        this.set("selected-category", this.get("categories")[0]);
	},

  calcCountByMonth: function(dataset, months){
    var countByMonth = {};
    var maxMonthlyCount = 0;
    var categoryNames = this.get("categories");

    dataset.addComputedColumn("Month", "string", function(row) {
      return months[row["Date"].month()];
    });

    _(months).each(function(month){
      var monthData = dataset.rows(function(r){ return r["Month"] == month });
      var maxCountThisMonth = 0;
      var countByCategory = monthData.groupBy("Category", ["Count"]);
      var categoryCountMap = {};

      countByCategory.each(function(row, rowIndex) {
        var count = row["Count"];
        maxCountThisMonth = Math.max(count, maxCountThisMonth);
        categoryCountMap[row["Category"]] = count;
      });

      countByMonth[month] = _.map(categoryNames,function(category){
        return { name: category, value: categoryCountMap[category] || 0 };
      });

      maxMonthlyCount = Math.max(maxCountThisMonth, maxMonthlyCount);
    });

    this.set("countByMonth", countByMonth);
    this.set("maxCount", maxMonthlyCount);
  },

  getCountFor: function(month){
  	return this.get("countByMonth")[month];
  }
});
