Collection = require 'models/base/collection'
UserReadingGoal = require 'models/UserReadingGoal'

# a collection of UserReadingGoal that represents a user's preference
# about how to allocate time per category
module.exports = class UserReadingGoals extends Collection
  model: UserReadingGoal

  localStorage: new Backbone.LocalStorage("UserReadingGoals")
