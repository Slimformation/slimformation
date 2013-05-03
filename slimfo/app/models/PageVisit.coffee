utils = require 'lib/utils'
Config = require 'config'
Model = require 'models/base/model'

module.exports = class PageVisit extends Model
  initialize: () ->
    @set 'created_at', (new Date()).getTime()

  created_at: null

  url: null

  category: null

  defaults:
    category: "Other"

  validate: (attrs, options) ->
    isChromeUrl = /^chrome/i.test attrs.url
    if isChromeUrl
      return "Not a valid URL."