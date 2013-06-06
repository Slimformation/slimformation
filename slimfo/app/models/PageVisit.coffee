utils = require 'lib/utils'
Config = require 'config'
Model = require 'models/base/model'

module.exports = class PageVisit extends Model

  # attributes...

  created_at: null
  updated_at: null
  url: null
  category: null
  title: null
  content: null
  wordCount: null
  readingScore: null

  # methods, etc ...

  defaults:
    created_at: 0
    updated_at: 0
    category: "other"

  validate: (attrs, options) ->
    isChromeUrl = /^chrome/i.test attrs.url
    if isChromeUrl
      return "Not a valid URL."
