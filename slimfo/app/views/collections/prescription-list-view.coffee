Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/charts/activity-chart'
utils = require 'lib/utils'

module.exports = class ActivityTableView extends View
  el: $('#prescription-list')
  autoRender: true
  autoAttach: true
  template: template

  sourceSort: ->
    category_source_dict = utils.categorySourceCountWithReadingLevelMap(@collection)
    #console.log category_source_dict
    category_source_arr =
      'politics': []
      'business':[]
      'technology': []
      'sports': []
      'science': []
      'entertainment': []
      'other': []

    for category of category_source_dict
      for url, pair of category_source_dict[category]
          category_source_arr[category].push([url, pair[0], pair[1]])
      category_source_arr[category].sort((a,b) -> b[1]-a[1])
    
    return category_source_arr
  
  #Returns sources that have 45% or more of the overall time spent in this category
  sourcesAboveTimeThreshold: (category_source_arr) ->
    totalTime = 0
    BIASED = 0.45
    biased_list = []
    _.each(category_source_arr, (source_time_pair) ->
      totalTime += source_time_pair[1]
    )

    _.each(category_source_arr, (source_time_pair) ->
      if(source_time_pair[1] >= BIASED*totalTime)
        biased_list.push(source_time_pair)
    )
    #console.log totalTime
    return biased_list

  #Returns the top 3 sources and corresponding reading level
  topThreeSourcesAndReadingScore: (category_source_arr) ->
    topThree = []
    for i in [0..2]
      topThree.push(category_source_arr[i])
    return topThree

  #Returns the average reading level for this category
  averageReadingLevel: (category_source_arr) ->
    totalTime = 0
    _.each(category_source_arr, (source_time_pair) ->
      totalTime += source_time_pair[1]
    )
    count = 0
    weightedAverageReadingLevel = 0
    #console.log category_source_arr
    _.each(category_source_arr, (pair) ->
      if _.isUndefined(pair[2])
        count += 0
      else
        proportionReadingLevel = pair[2]*(pair[1]/totalTime)
        count += 1
        weightedAverageReadingLevel += proportionReadingLevel
    )

    return [count, weightedAverageReadingLevel]

  getReadingBudget: (category, readingBudgetsModel) ->
    model = readingBudgetsModel
    readingBudgets =     
      'politics': {}
      'business':{}
      'technology': {}
      'sports': {}
      'science': {}
      'entertainment': {}
    rbs = model['models']
    for i in [0..5]
      readingBudgets[rbs[i]['attributes']['category']] = rbs[i]['attributes']
    rb = readingBudgets[category]
    return rb

  goalsCheckup: (category) ->
    THRESHOLD = 5
    pl=$('#prescription-list')
    rb = @getReadingBudget(category, @collection)
    pl.append("</br></br>")
    pl.append("<b>Goals</b>: ")
    console.log rb
    if (Math.abs(rb['actual']-rb['projected'])<=THRESHOLD) #within threshold of projected
      pl.append("Congrats! You met your goal for " + category + ".")
    else if ((rb['actual']-rb['projected'])>THRESHOLD)
      pl.append("Oops! You went over your budget for " + category + ". Try cutting back on " + category + ".")
    else
      pl.append("You didn't meet your goal for " + category + ". Try to focus on reading more about " +category)

  diversityAndReadingLevelCheckup: (category) ->
    pl=$('#prescription-list')
    total_category_source_arr = @sourceSort()

    if _.isEmpty(total_category_source_arr) #no data collected yet
      pl.append("No data collected yet. Try browsing some sites first.")
    else
      category_source_arr = total_category_source_arr[category]
      sourcesAboveThreshold = @sourcesAboveTimeThreshold(category_source_arr)
      #console.log sourcesAboveThreshold
      #Get the top three sources along with the reading level: array of length 3 of arrays[baseUrl, timeSpent, and readingScore]
      #topThreeSources = @topThreeSourcesAndReadingScore(category_source_arr)
      avgReadingLevel = @averageReadingLevel(category_source_arr)
      #console.log "AVG RL:"
      #console.log avgReadingLevel
      #console.log topThreeSources
      
      #If no sources above threshold
      pl.append("</br></br>")
      pl.append("<b>Diversity</b>: ")
      if _.isEmpty(sourcesAboveThreshold)
        pl.append("You have been doing well in terms of getting content about " + category + " from different sources!")
      else #Source above threshold - report it
        pl.append("Oh no! You've been viewing too much content about " + category + " from ")
        if sourcesAboveThreshold.length==2
          pl.append(sourcesAboveThreshold[0][0] + " and " + sourcesAboveThreshold[1][0] + ". Try some other sources!")
        else
          pl.append(sourcesAboveThreshold[0][0] + ". Try some other sources!")

      #Display 3 top reading level / sources
      pl.append("</br></br>")
      pl.append("<b>Reading Level</b>: ")
      if avgReadingLevel[0]==0 #No sources had reading level
        pl.append("No data collected so far. Try viewing more sites.")
      else #we have reading level data
        pl.append("Weighted Average Flesch-Kincaid score for " + category + " is " + avgReadingLevel[1].toFixed(2) + ". ")
        #rate the reading level based on wikipedia flesch kincaid
        if avgReadingLevel[1]>=90
          pl.append("You are currently reading at the same level as an 11-year old. Try to step it up!")
        else if (avgReadingLevel[1]>=60) and (avgReadingLevel[1] < 90)
          pl.append("You are currently reading at the level of a high schooler. Not bad, but you can do better!")
        else if (avgReadingLevel[1]>30) and (avgReadingLevel[1] < 60)
          pl.append("You are currently reading at the level of a college student. Good work!")
        else if avgReadingLevel[1]<=30
          pl.append("You are reading at an extremely high level. Be proud of yourself!")