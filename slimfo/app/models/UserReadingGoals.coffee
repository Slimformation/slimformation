Collection = require 'models/base/collection'
ReadingBudget = require 'models/ReadingBudget'

# a collection of ReadingBudgets that represents a user's preference
# about how to allocate time per category
module.exports = class UserReadingGoals extends Collection
  model: ReadingBudget

  localStorage: new Backbone.LocalStorage("UserReadingGoals")

