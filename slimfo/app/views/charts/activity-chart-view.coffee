Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/charts/activity-chart'

module.exports = class ActivityChartView extends View
  el: $('#activity-chart-container')
  autoRender: true
  autoAttach: true
  template: template

  parsePageVisits: ->
    page_visit_count = @collection.length
    page_visits = @collection.models
    page_visits_dict = { 'politics': [], 'business': [], 'technology': [], 'sports': [], 'science': [], 'entertainment': [], 'other': [] }

    for page_visit in page_visits
      page_visits_dict[page_visit.attributes.category].push(page_visit.attributes)

    return page_visits_dict

  initChart: ->
    page_visits_by_category = @parsePageVisits()

    nv.addGraph(->
      chart = nv.models.pieChart().x((d) -> return d.key).values((d) -> return d).showLabels(true).color(d3.scale.category10().range()).labelThreshold(.05).donut(true)

      data = [
        {
          key: "Politics",
          y: page_visits_by_category['politics'].length
        },
        {
          key: "Business",
          y: page_visits_by_category['business'].length
        },
        {
          key: "Technology",
          y: page_visits_by_category['technology'].length
        },
        {
          key: "Sports",
          y: page_visits_by_category['sports'].length
        },
        {
          key: "Science",
          y: page_visits_by_category['science'].length
        },
        {
          key: "Entertainment",
          y: page_visits_by_category['entertainment'].length
        },
        {
          key: "Other",
          y: page_visits_by_category['other'].length
        }
      ]

      d3.select('#chart svg').datum([data]).transition().duration(1200).call(chart)

      return chart
      )
