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
    page_visits_dict = { 'politics': 0, 'business': 0, 'technology': 0, 'sports': 0, 'science': 0, 'entertainment': 0, 'other': 0 }

    for page_visit in page_visits
      #console.log page_visit.attributes

      counter = Math.round((page_visit.attributes.updated_at - page_visit.attributes.created_at)/60)
      if counter == 0
        continue
      page_visits_dict[page_visit.attributes.category] += counter

    page_visits_array = []
    for topic, time of page_visits_dict
      page_visits_array.push([topic, time])

    #sort the array by time
    page_visits_array.sort((a,b) -> b[1]-a[1])

    return page_visits_array

  initChart: ->
    page_visits_by_category = @parsePageVisits()
    #console.log page_visits_by_category

    nv.addGraph(->
      chart = nv.models.pieChart().x((d) -> return d.key).values((d) -> return d).showLabels(true).color(d3.scale.category10().range()).labelThreshold(.05).donut(true)
      
      data = []
      for item in page_visits_by_category
        word = item[0].charAt(0).toUpperCase() + item[0].slice(1)
        data.push({key: word, y: item[1]})

      d3.select('#chart svg').datum([data]).transition().duration(1200).call(chart)

      return chart
      )
