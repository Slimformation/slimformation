utils = require 'lib/utils'
Config = require 'config'
Service = require 'services/base/service'

module.exports = class CategorizerService extends Service
  constructor: ->
    super
    # listen to PageVisit add event
    @subscribeEvent 'add:PageVisit', @categorize

  # callback that is called with a newly added PageVisit, and categorizes it
  categorize: (pageVisit) ->
    pageUrl = pageVisit.attributes.url
    return if pageUrl == null
    console.log "trying to categorize #{pageUrl}"
    $.ajax(
      url: Config.categorizerEndpoint + "?url=#{pageUrl}"
    ).done((data) ->
      pageVisit.save
        category: data.category
    ).fail((data) ->
      console.log "Ajax request failed"
      console.log data
    )