Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/charts/activity-chart'
utils = require 'lib/utils'

module.exports = class ActivityChartView extends View
  el: $('#activity-chart-container')
  autoRender: true
  autoAttach: true
  template: template

  parsePageVisits: ->
    page_visit_count = @collection.length
    page_visits = @collection.models
    page_visits_dict =
      'politics': 0
      'business': 0
      'technology': 0
      'sports': 0
      'science': 0
      'entertainment': 0
      'other': 0

    _.each(page_visits, (page_visit) ->
      counter = utils.elapsedTimeInMin(page_visit.attributes.created_at, page_visit.attributes.updated_at)
      page_visits_dict[page_visit.attributes.category] += counter
    )

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
        ).showLabels(true)
        .color(
          d3.scale.category10().range()
        ).labelThreshold(.05)
        .donut(true)
      
        data = _.map(page_visits_by_category, (item) ->
          word = utils.capitalizeFirstLetter(item[0])
          return {key: word, y: item[1]}
        )

      d3.select('#chart svg')
        .datum([data])
        .transition()
        .duration(1200)
        .call(chart)

      return chart
    )
