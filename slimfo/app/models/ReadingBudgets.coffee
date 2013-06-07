Collection = require 'models/base/collection'
ReadingBudget = require 'models/ReadingBudget'
NewPageVisits = require 'models/NewPageVisits'
UserReadingGoals = require 'models/UserReadingGoals'
utils = require 'lib/utils'

# a collection of ReadingBudgets that represents a collection
# of models which tell how user reading goals are being met
module.exports = class ReadingBudgets extends Collection
  model: ReadingBudget

  # localStorage: new Backbone.LocalStorage("ReadingBudgets")

  # gather and return collection of ReadingBudget's, with each having
  # a % score which indicates how much of its allotment is used up.
  # An allotment is simply how much of the most read category has been read
  fetch: (options) ->
    npv = new NewPageVisits
    $.when(
      npv.fetch()
    ).then((npv) ->
      utils.categoryReadingAmountMap(npv)
    ).then((cat_read_map) ->
      # determine actual ratios of usage
    )
