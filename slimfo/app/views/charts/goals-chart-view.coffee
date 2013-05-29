Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/charts/goals-chart'

module.exports = class GoalsChartView extends View
  el: $('#goals-chart-container')
  autoRender: true
  autoAttach: true
  template: template

  initChart: ->
    politics_data = {
      'title': 'Politics',
      'subtitle': 'Reading goals (hrs)',
      'ranges': [150, 225, 300],
      'measures': [200],
      'markers': [250]
    }

    business_data = {
      'title': 'Business',
      'subtitle': 'Reading goals (hrs)',
      'ranges': [25, 10, 100],
      'measures': [70],
      'markers': [80]
    }

    nv.addGraph(->
      chart = nv.models.bulletChart()

      d3.select('#politics').datum(politics_data).transition().duration(1000).call(chart)

      return chart
      )

