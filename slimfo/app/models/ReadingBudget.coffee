Model = require 'models/base/model'

module.exports = class ReadingBudget extends Model
  created_at: null
  updated_at: null

  category: ""
  value: null

  defaults:
    value: 0
    created_at: (new Date()).getTime()
    updated_at: (new Date()).getTime()
    
  validate: (attrs, options) ->
    if @value > 100 or @value < 0
      return "Value of ReadingBudget out of range"
