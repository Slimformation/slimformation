Collection = require 'models/base/collection'
ReadingBudget = require 'models/ReadingBudget'

# a collection of ReadingBudgets that represents a collection
# of models which tell how user reading goals are being met
module.exports = class ReadingBudgets extends Collection
  model: ReadingBudget

  localStorage: new Backbone.LocalStorage("ReadingBudgets")
