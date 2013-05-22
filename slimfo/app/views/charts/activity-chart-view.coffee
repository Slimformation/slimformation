Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/charts/activity-chart'

module.exports = class ActivityChartView extends View
  el: $('#activity-chart-container')
  autoRender: true
  autoAttach: true
  template: template

  # initialize: ->
  #   super
    # '!region:show' is fired on this view after @attach is executed
    # Chaplin.mediator.subscribe '!region:show', @initChart, @

  # render: ->
  #   super
  #   @initChart()
  #   @

  initChart: ->
    ctx = document.getElementById('activity-chart').getContext("2d")
    data = [
        value: 30
        color:"#F7464A"
      ,
        value : 50
        color : "#E2EAE9"
      ,
        value : 100
        color : "#D4CCC5"
    ]
    console.log ctx
    activityChart = new Chart(ctx).Doughnut(data)
