Model = require 'models/base/model'

module.exports = class ReadingBudget extends Model
  created_at: null
  updated_at: null

  # similar to models/UserReadingGoal
  category: ""
  value: null
  # attrs for propotions...
  projected: null
  actual: null

  defaults:
    value: 0
    projected: 0
    actual: 0
    
  validate: (attrs, options) ->
    if @value > 100 or @value < 0
      return "Value of ReadingBudget out of range"
