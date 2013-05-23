Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/charts/goals-chart'

module.exports = class GoalsChartView extends View
  el: $('#goals-chart-container')
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
    # data = [
    #     labels: ["January","February","March","April","May","June","July"],
    #     datasets: [
    #       {
    #         fillColor : "rgba(220,220,220,0.5)"
    #         strokeColor : "rgba(220,220,220,1)"
    #         data : [65,59,90,81,56,55,40]
    #       },
    #       {
    #         fillColor : "rgba(151,187,205,0.5)"
    #         strokeColor : "rgba(151,187,205,1)"
    #         pointColor : "rgba(151,187,205,1)"
    #         pointStrokeColor : "#fff"
    #         data : [28,48,40,19,96,27,100]
    #       }
    #     ]
    # ]
    # console.log ctx
    # goalsChart = new Chart(ctx).Bar(data)
    # ctx = document.getElementById('goals-chart').getContext("2d")
    data = [4, 8, 15, 16, 23, 32]
    labels = {4: 'Food', 8: 'Politics', 15: 'Science', 16: 'Tech', 23: 'Business', 32: 'Sports'}

    chart = d3.select('#goals-chart-container').append('div').attr('class', 'chart')

    chart.selectAll("div")
        .data(data)
      .enter().append("div")
        .style("width", (d) -> d * 10 + "px")
        .text((d) -> labels[d] )
