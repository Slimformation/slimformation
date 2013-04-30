Model = require 'models/base/model'

module.exports = class PageVisit extends Model
  initialize: () ->
    @set 'created_at', (new Date()).getTime()

  build: (options) ->
    @set 'url', options.url

  created_at: null

  url: null
