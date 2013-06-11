Chaplin = require 'chaplin'

# Application-specific utilities
# ------------------------------

elapsedTimeInSec = (tsec1, tsec2) ->
  Math.abs(tsec1 - tsec2)

elapsedTimeInMin = (tsec1, tsec2) ->
  elapsedTimeInSec(tsec2 - tsec1)/60

# Delegate to Chaplin’s utils module
utils = Chaplin.utils.beget Chaplin.utils

_(utils).extend
  removeProtocol: (url) ->
    url.replace(/.*?:\/\//g, "")

  validListenUrl: (url) ->
    falseConditions = [
      /^chrome/i.test(url),
      /www.google.com\/search/i.test(url)
    ]
    testAll = _.reduce(falseConditions, ((element, memo) ->
      memo = memo || element
    ), false, this)
    return !testAll

  elapsedTimeInSec: elapsedTimeInSec

  elapsedTimeInMin: elapsedTimeInMin

  capitalizeFirstLetter: (word) ->
    word.charAt(0).toUpperCase() + word.slice(1)
 
  detailedTime: (numSeconds) ->
    sec = numSeconds % 60
    diff = numSeconds-sec
    min = Math.round(Math.abs(diff/60) % 60)
    diffDiff = diff - min*60
    hr = Math.round(Math.abs(diffDiff/3600) % 60)
    {
      hours: Number(hr)
      minutes: Number(min)
      seconds: Number(sec)
    }

  # takes a detailed time object object, returns a descriptive string
  humanizeTime: (detTimeObj) ->
    out = ""
    if Number(detTimeObj.hours) != 0
      out += detTimeObj.hours.toString() + " h"
    if Number(detTimeObj.minutes) != 0
      out += " " + detTimeObj.minutes.toString() + " m"
    if Number(detTimeObj.seconds) != 0
      out += " " + detTimeObj.seconds.toString() + " s"
    if out is ""
      out = "none"
    return out

  # takes a NewPageVisits collection and buils a map that has the
  # categories as the keys and the total reading time in seconds as
  # the value 
  categoryReadingAmountMap: (collection) ->
    page_visit_count = collection.length
    page_visits = collection.models
    page_visits_dict =
      'politics': 0
      'business': 0
      'technology': 0
      'sports': 0
      'science': 0
      'entertainment': 0
      'other': 0

    _.each(page_visits, (page_visit) ->
      counter = elapsedTimeInSec(page_visit.attributes.created_at, page_visit.attributes.updated_at)
      page_visits_dict[page_visit.attributes.category] += counter
    )
    return page_visits_dict

  # takes a NewPageVisits collection and builds a map that has the
  # categories as the keys, and a map of the top sources and their
  # total reading time as the values.
  categorySourceCountMap: (collection) ->
    page_visit_count = collection.length
    page_visits = collection.models
    siteRegexp = /^(\w+:\/\/[^\/]+).*$/

    category_source_dict =
      'politics': {}
      'business':{}
      'technology': {}
      'sports': {}
      'science': {}
      'entertainment': {}
      'other': {}

    _.each(page_visits, (page_visit) ->
      counter = elapsedTimeInSec(page_visit.attributes.created_at,
                                 page_visit.attributes.updated_at)
      url_tuple = page_visit.attributes.url.match(siteRegexp)
      base_url = _.last(url_tuple)
      if _.isUndefined(category_source_dict[page_visit.attributes.category][base_url])
        category_source_dict[page_visit.attributes.category][base_url]=counter
      else
        category_source_dict[page_visit.attributes.category][base_url]+=counter
    )

    return category_source_dict

  # given a category reading amount map, which has keys as categories
  # and the total reading amount as the values, this produces a map
  # with the same keys but with propotion of the combined reading
  # amount as the value
  categoryReadingProportionsMap: (catReadingAmountMap) ->
    total = _.reduce(catReadingAmountMap, ((acc, v, k) ->
        acc += Number(v)
      ), 0)
    newMap = _.reduce(catReadingAmountMap, ((acc, v, k) ->
      acc[k] = Number(v)/Number(total)
      return acc
      ), {})
    return newMap

module.exports = utils
