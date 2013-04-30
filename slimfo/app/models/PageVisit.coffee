Model = require 'models/base/model'

module.exports = class PageVisit extends Model
  initialize: () ->
    @set 'created_at', (new Date()).getTime()

  created_at: null

  url: null
