Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/charts/activity-chart'
utils = require 'lib/utils'

module.exports = class ActivityChartView extends View
  autoRender: true
  autoAttach: true
  template: template
  className: 'activity-chart-view'

  parsePageVisits: ->
    page_visits_dict = utils.categoryReadingAmountMap(@collection)

    # recast the collection as an array of [topic, time] arrays
    page_visits_array = _.map(page_visits_dict, (value, key) -> [key, value])

    # sort the array by amount of time
    page_visits_array = _.sortBy(page_visits_array, (a, b) -> b[1] - a[1])

    return page_visits_array

  initChart: ->
    page_visits_by_category = @parsePageVisits()

    nv.addGraph(->
      chart = nv.models
        .pieChart()
        .x((d) ->
          return d.key
        ).values((d) ->
          return d
        ).showLabels(false)
        .color(
          d3.scale.category10().range()
        ).labelThreshold(.05)
        .donut(true)

        data = _.map(page_visits_by_category, (item) ->
          word = utils.capitalizeFirstLetter(item[0])
          return {key: word, y: (Number(item[1])/60)}
        )

      d3.select('#chart svg')
        .datum([data])
        .transition()
        .duration(1200)
        .call(chart)

      return chart
    )
