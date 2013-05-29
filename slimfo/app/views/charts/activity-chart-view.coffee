Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/charts/activity-chart'

module.exports = class ActivityChartView extends View
  el: $('#activity-chart-container')
  autoRender: true
  autoAttach: true
  template: template

  politics_color = "#F7464A"
  business_color = "#E2EAE9"
  technology_color = "#D4CCC5"
  sports_color = "#ccc"
  science_color = "#9c9c9c"
  entertainment_color = "#000"
  other_color = "#c30000"

  parsePageVisits: ->
    page_visit_count = @collection.length
    page_visits = @collection.models
    page_visits_dict = { 'politics': 0, 'business': 0, 'technology': 0, 'sports': 0, 'science': 0, 'entertainment': 0, 'other': 0 }

    for page_visit in page_visits
      #console.log "C: " + page_visit.attributes.created_at + " - " + "U:  " + page_visit.attributes.updated_at
      counter = (page_visit.attributes.updated_at - page_visit.attributes.created_at)/1000
      page_visits_dict[page_visit.attributes.category] += counter

    #console.log page_visits_dict
    return page_visits_dict

  initChart: ->
    #console.log 'init chart'
    window.npv = @collection
    page_visits_by_category = @parsePageVisits()

    #console.log page_visits_by_category
    ctx = document.getElementById('activity-chart').getContext("2d")

    data = [
        value: page_visits_by_category['politics']
        color:politics_color
      ,
        value: page_visits_by_category['business']
        color : business_color
      ,
        value : page_visits_by_category['technology']
        color : technology_color
      ,
        value : page_visits_by_category['sports']
        color : sports_color
      ,
        value : page_visits_by_category['science']
        color : science_color
      ,
        value : page_visits_by_category['entertainment']
        color : entertainment_color
      ,
        value : page_visits_by_category['other']
        color : other_color
    ]
    #console.log ctx
    activityChart = new Chart(ctx).Doughnut(data)
