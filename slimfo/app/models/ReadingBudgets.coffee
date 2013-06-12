Collection = require 'models/base/collection'
ReadingBudget = require 'models/ReadingBudget'
NewPageVisits = require 'models/NewPageVisits'
UserReadingGoals = require 'models/UserReadingGoals'
utils = require 'lib/utils'

# a collection of ReadingBudgets that represents a collection
# of models which tell how user reading goals are being met
module.exports = class ReadingBudgets extends Collection
  model: ReadingBudget

  localStorage: new Backbone.LocalStorage("ReadingBudgets")

  # gather and return collection of ReadingBudget's, with each having
  # a % score which indicates how much of its allotment is used up.
  # An allotment is simply how much of the most read category has been read
  # fetch: (options) ->
  #   actualUsage = {}
  #   $.when(
  #     npv = new NewPageVisits
  #     npv = npv.fetch()
  #   ).then((npv) ->
  #     cat_read_map = utils.categoryReadingAmountMap(npv)
  #     actualUsage = utils.categoryReadingProportionsMap(cat_read_map)
  #   )
  #   projectedUsage = {}
  #   $.when(
  #     urg = new UserReadingGoals
  #     urg.fetch()
  #   ).then((urg) ->
  #     projectedUsage = urg
  #   )

