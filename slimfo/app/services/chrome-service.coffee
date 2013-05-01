Chaplin = require 'chaplin'
Service = require 'services/base/service'
PageVisit = require 'models/PageVisit'
NewPageVisits = require 'models/NewPageVisits'

module.exports = class ChromeService extends Service
  constructor: ->
    super
    @subscribeEvent 'listen:onUpdatedTab', @onUpdatedTab

  onUpdatedTab: () ->
    chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
      if changeInfo.url == undefined
        return
      console.log "Update: the url of tab #{tabId} changed to #{changeInfo.url}" 
      # pv = new PageVisit
      # pv.set
      #   url: changeInfo.url
      # pv.save
      npv = new NewPageVisits
      pv = npv.create
        url: changeInfo.url
      Chaplin.mediator.publish 'add', pv
     
