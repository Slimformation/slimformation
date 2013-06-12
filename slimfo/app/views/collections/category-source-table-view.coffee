Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/charts/activity-table'
utils = require 'lib/utils'

module.exports = class ActivityTableView extends View
  # el: $('#activity-chart-container')
  autoRender: true
  autoAttach: true
  template: template
  className: 'activity-table-view'

  sourceSort: ->
    category_source_dict = utils.categorySourceCountMap(@collection)

    category_source_arr =
      'politics': []
      'business':[]
      'technology': []
      'sports': []
      'science': []
      'entertainment': []
      'other': []
        
    for category of category_source_dict
      for url, time of category_source_dict[category]
        category_source_arr[category].push([url, time])
      category_source_arr[category].sort((a,b) -> b[1]-a[1])
    
    return category_source_arr

  initTable: ->
    category_source_arr = @sourceSort()
    #console.log "IN INIT TABLE"
    #console.log category_source_arr

    $('#source-page-visits').append("<b style='font-size:24px'>Top Sources Per Category</b>")
    $('#source-page-visits').append("<table class='table table-striped table-condensed table-hover' id='cat-source-table'></table>")
    $('#cat-source-table').append("<thead><th>Category</th><th>Time</th></thead>")
    for category of category_source_arr
      word = utils.capitalizeFirstLetter(category)

      $('#cat-source-table').append("<tr><td><b>"+word+"</b></td><td></td></tr>")
      if category_source_arr[category].length>0 #given there data to show, then show it
        for i in [0..Math.min(category_source_arr[category].length-1, 2)] #Need to watch out for when we don't have much data
          timer = category_source_arr[category][i][1]
          # console.log timer
          humanizedTimer = utils.humanizeTime(utils.detailedTime(timer))
          
          $('#cat-source-table').append("<tr><td>" + category_source_arr[category][i][0] + "</td><td class='time'>" + humanizedTimer + "</td></tr>")
      else #there isn't any data
        $('#cat-source-table').append("<tr><td>No sites visited yet for this category!</td></tr>")
      $('#cat-source-table').append("</br>")
   
