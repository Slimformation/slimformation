NewPageVisits = require 'models/NewPageVisits'
utils = require 'lib/utils'
config = require 'config'
  
NewUserHelper =
    # returns whether a user is a new user of the app or not
  isNewUser: () ->
    totalReadTime = 0
    # calculate reading amount
    $.when(
      collection = new NewPageVisits
      collection.fetch()
    ).then (collection) ->
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
        counter = utils.elapsedTimeInSec(page_visit.attributes.created_at, page_visit.attributes.updated_at)
        page_visits_dict[page_visit.attributes.category] += counter
      )

      totalReadTime = _.reduce(page_visits_dict, ((acc, value) ->
        acc += value
      ), 0)

    if totalReadTime < config.secondsBeforeActive
      return true
    else
      return false

module.exports = NewUserHelper
