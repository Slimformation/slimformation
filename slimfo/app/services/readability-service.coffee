ReadingScore = require 'lib/reading-score'
Config = require 'config'
Service = require 'services/base/service'

module.exports = class ReadabilityService extends Service
  constructor: ->
    super
    # listen to PageVisit add event
    @subscribeEvent 'add:PageVisit', @simplify


  # given a PageVisit, queries Readability API to investigate
  # the content of the web page
  simplify: (pageVisit) ->
    pageUrl = pageVisit.attributes.url
    return if pageUrl == null
    console.log "trying to simplify #{pageUrl}"
    $.ajax(
      url: Config.simplifierEndpoint + "?url=#{pageUrl}"
    ).done((data) ->
      pageVisit.save(
        title: data.title
        content: data.content
        wordCount: data.word_count
        readingScore: (new ReadingScore($(data.content).text())).fleschKincaid()
      ).then (pv) ->
          console.log pv
    ).fail((data) ->
      console.log "Ajax request failed"
      console.log data
    )