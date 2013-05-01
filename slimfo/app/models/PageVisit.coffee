utils = require 'lib/utils'
Config = require 'config'
Model = require 'models/base/model'

module.exports = class PageVisit extends Model
  initialize: () ->
    @set 'created_at', (new Date()).getTime()
    @subscribeEvent 'add', @categorize

  created_at: null

  url: null

  category: null

  # callback that is called with a newly added PageVisit, and categorizes it
  categorize: (pageVisit) ->
    pageUrl = pageVisit.attributes.url
    console.log "trying to categorize #{pageUrl}"
    if pageUrl == null
      return
    $.ajax(
      url: Config.categorizerEndpoint + "?url=#{utils.removeProtocol(pageUrl)}"
    ).done (data) ->
      pageVisit.save
        category: data.category