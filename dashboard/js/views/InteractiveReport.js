var InteractiveReport = Backbone.View.extend({

  initialize: function(options){
    this.model = options.model;
    this.report = new CategoryCountReport({ model: options.model });

    _.bindAll(this);
  },

  append: function(child){
    this.$el.append(child.el);
    child.parent = this;
  },

  clear: function(){
    this.$el.empty();
  },

  render: function(){
    var wrapper = this;
    var report = this.report;
    var model = this.model;
    var months = model.get("months");
    var currentCategory = model.get("selected-category");

    this.clear();
    this.append(report);

    report.render();

    _(months).each(function(month){
      var chart = report.charts[month];
      var svg = chart.barchart.svg;

      wrapper.addSelectionEvents(svg, ".bar", model);
    });

    wrapper.addSelectionEvents(report.key.svg, ".key-item", model);

    model.set("selected-category", "");
    model.set("selected-category", currentCategory);
  },

  addSelectionEvents: function(svg, nodeClass, model){
    svg.selectAll(nodeClass)
        .on("click", function(item){
          var category = (item.name) ? item.name : item;
          model.set("selected-category", category);
        });

    model.on("change:selected-category", function(){
      var selected = model.get("selected-category");

      svg.selectAll(nodeClass)
          .classed("selected", function(d){
            return d == selected || d.name == selected;
          });
    });
  },

  reveal: function(){
    this.report.reveal();
  },
});
