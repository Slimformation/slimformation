Service = require 'services/base/service'

module.exports = class ChromeService extends Service
  constructor: ->
    super
    @subscribeEvent 'listen:onUpdatedTab', @onUpdatedTab

  onUpdatedTab: () ->
    chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
      console.log "Update: the url of tab #{tabId} changed to #{changeInfo.url}"
