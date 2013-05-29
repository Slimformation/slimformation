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
      console.log page_visit.attributes.category
      page_visits_dict[page_visit.attributes.category].push(page_visit.attributes)

    console.log page_visits_dict
    return page_visits_dict

  initChart: ->
    console.log 'init chart'
    window.npv = @collection
    page_visits_by_category = @parsePageVisits()

    console.log page_visits_by_category
    ctx = document.getElementById('activity-chart').getContext("2d")

    data = [
        value: page_visits_by_category['politics'].length
        color:"#F7464A"
      ,
        value: page_visits_by_category['business'].length
        color : "#E2EAE9"
      ,
        value : page_visits_by_category['technology'].length
        color : "#D4CCC5"
      ,
        value : page_visits_by_category['sports'].length
        color : "#ccc"
      ,
        value : page_visits_by_category['science'].length
        color : "#9c9c9c"
      ,
        value : page_visits_by_category['entertainment'].length
        color : "#000"
      ,
        value : page_visits_by_category['other'].length
        color : "#c30000"
    ]
    console.log ctx
    activityChart = new Chart(ctx).Doughnut(data)
