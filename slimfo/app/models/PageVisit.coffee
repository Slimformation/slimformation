utils = require 'lib/utils'
Config = require 'config'
Model = require 'models/base/model'

module.exports = class PageVisit extends Model
  # initialize: () ->
  #   @set 'created_at', (new Date()).getTime()
  #   @set 'updated_at', (new Date()).getTime()

  created_at: null

  updated_at: null

  url: null

  category: null

  title: null

  content: null

  wordCount: null

  readingScore: null


  defaults:
    created_at: Math.round((new Date()).getTime() / 1000) # in seconds
    updated_at: Math.round((new Date()).getTime() / 1000) # in seconds
    category: "other"

  validate: (attrs, options) ->
    isChromeUrl = /^chrome/i.test attrs.url
    if isChromeUrl
      return "Not a valid URL."
