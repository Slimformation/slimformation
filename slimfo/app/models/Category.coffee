Model = require 'models/base/model'

module.exports = class Category extends Model
  defaults:
    name: ""
    count: 0 

  name: undefined

  count: undefined

