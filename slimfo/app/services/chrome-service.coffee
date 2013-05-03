Chaplin = require 'chaplin'
Service = require 'services/base/service'
PageVisit = require 'models/PageVisit'
NewPageVisits = require 'models/NewPageVisits'

module.exports = class ChromeService extends Service
  constructor: ->
    super
    # listen to updated tabs
    @subscribeEvent 'listen:onUpdatedTab', @onUpdatedTab

  # handler that is called when chrome tabs need to listened to
  # when they update
  onUpdatedTab: () ->
    chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
      # check if URL is valid
      return if (changeInfo.url == undefined) or (/^chrome/i.test(changeInfo.url)) 
      console.log "Update: the url of tab #{tabId} changed to #{changeInfo.url}" 
      # add new PageVisit
      npv = new NewPageVisits
      pv = npv.create
        url: changeInfo.url
      Chaplin.mediator.publish 'add:PageVisit', pv
      # send a message to the content script in that tab
      chrome.tabs.getSelected null, (tab) ->
        chrome.tabs.sendMessage tab.id, {greeting: "hello"}, (response) ->
          console.log response
     
