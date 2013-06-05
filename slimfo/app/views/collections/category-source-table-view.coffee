Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/charts/activity-chart'

module.exports = class ActivityTableView extends View
  el: $('#activity-chart-container')
  autoRender: true
  autoAttach: true
  template: template

  sourceSort: ->
    page_visit_count = @collection.length
    page_visits = @collection.models
    siteRegexp = /^(\w+:\/\/[^\/]+).*$/

    category_source_dict = { 'politics': {}, 'business':{}, 'technology': {}, 'sports': {}, 'science': {}, 'entertainment': {}, 'other': {}}
    for page_visit in page_visits
      counter = Math.round((page_visit.attributes.updated_at - page_visit.attributes.created_at)/60)
      if(counter == 0)
        continue
      url_tuple = page_visit.attributes.url.match(siteRegexp)
      base_url = _.last(url_tuple)
      if _.isUndefined(category_source_dict[page_visit.attributes.category][base_url])
        category_source_dict[page_visit.attributes.category][base_url]=counter
      else
        category_source_dict[page_visit.attributes.category][base_url]+=counter
      counter=0

    category_source_arr = { 'politics': [], 'business':[], 'technology': [], 'sports': [], 'science': [], 'entertainment': [], 'other': []}
    for category of category_source_dict
      for url, time of category_source_dict[category]
        category_source_arr[category].push([url, time])
      category_source_arr[category].sort((a,b) -> b[1]-a[1])
    #console.log category_source_arr
    return category_source_arr

  initTable: ->
    category_source_arr = @sourceSort()
    #console.log "IN INIT TABLE"
    #console.log category_source_arr
    $('#source-page-visits').append("<h3>Top Sources for Each Category</h3>")
    $('#source-page-visits').append("<table class='table table-striped table-condensed table-hover'>")
    for category of category_source_arr
      word = category.charAt(0).toUpperCase() + category.slice(1)
      $('#source-page-visits').append("<tr><td><h4>"+word+"</h4></td></tr>")
      if category_source_arr[category].length>0 #given there data to show, then show it
        for i in [0..Math.min(category_source_arr[category].length-1, 2)] #Need to watch out for when we don't have much data
          timer = category_source_arr[category][i][1].toFixed(0);
          if ((i%2)==1) #if odd
            $('#source-page-visits').append("<tr class='row-blank'><td>" + category_source_arr[category][i][0] + "</td><td class='time'>" + timer + " min</td></tr>")
          else
            $('#source-page-visits').append("<tr class='row-shaded'><td>" + category_source_arr[category][i][0] + "</td><td class='time'>" + timer + " min</td></tr>")
      else #there isn't any data
        $('#source-page-visits').append("<tr><td>No sites visited yet for this category!</td></tr>")
      $('#source-page-visits').append("</br>")
    $('#source-page-visits').append("</table>")
