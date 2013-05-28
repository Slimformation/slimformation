utils = require 'lib/utils'
Config = require 'config'
Service = require 'services/base/service'
ReadingScore = require 'lib/reading-score'

module.exports = class NewscatService extends Service
  constructor: ->
    super
    # listen to PageVisit add event
    @subscribeEvent 'add:PageVisit', @categorize
 
  categorize: (pageVisit) ->
    pageUrl = pageVisit.attributes.url
    return if pageUrl == null
    console.log "sending #{pageUrl} to newscat for nomz"
    $.ajax(
      url: Config.newscatEndpoint + "?url=#{pageUrl}"
    ).done((data) ->
      pageVisit.save
        category: data['best-category']
        title: data.title
        content: data.content
        wordCount: data.word_count
        readingScore: (new ReadingScore($(data.content).text())).fleschKincaid()        
    ).fail((data) ->
      console.log "Ajax request failed"
      console.log data
    )   
