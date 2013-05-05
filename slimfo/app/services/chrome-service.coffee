Chaplin = require 'chaplin'
Service = require 'services/base/service'
PageVisit = require 'models/PageVisit'
NewPageVisits = require 'models/NewPageVisits'

module.exports = class ChromeService extends Service
  constructor: ->
    super
    # listen to updated tabs
    @subscribeEvent 'listen:onUpdatedTab', @onUpdatedTab
    @subscribeEvent 'listen:activityPort', @updateActvity

  # handler that is called when chrome tabs need to listened to
  # when they update
  # http://developer.chrome.com/extensions/messaging.html
  onUpdatedTab: () ->
    chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
      # check if URL is valid
      return if (changeInfo.url == undefined) or (/^chrome/i.test(changeInfo.url)) 
      console.log "Tab Update: the url of tab #{tabId} changed to #{changeInfo.url}" 
      # add new PageVisit
      npv = new NewPageVisits
      pv = npv.create
        url: changeInfo.url
      Chaplin.mediator.publish 'add:PageVisit', pv

      # example of sending one-off message and printing response:
      # send a message to the content script in that tab
      # chrome.tabs.getSelected null, (tab) ->
      #   chrome.tabs.sendMessage tab.id, {greeting: "hello"}, (response) ->
      #     console.log response


  # handler to update activity for page visits
  # http://developer.chrome.com/extensions/messaging.html
  updateActvity: () ->
    npv = new NewPageVisits
    # connect to port, send hello, and start listening to updates
    chrome.runtime.onConnect.addListener (port) ->
      console.assert port.name == "activity"
      port.postMessage
        type: "initialize"
      port.onMessage.addListener (msg) ->
        console.log "Activity Update: " + msg
        switch msg.type
          when "update"
            npv.fetch().then(->
             npv.findWhere {url: msg.pageVisitUrl}
            ).then((pv) ->
              pv.save
                updated_at: msg.timestamp
            )
            # console.log pv
            # do (pv) ->
            #   pv.save {updated_at: msg.timestamp}
