# chrome extension stuff here...
# hopefully this works as a mixin too (as in `_.extend blah`)

ChromeInterop =
  withActiveTabs: (callback) ->
    queryInfo =
      active: true
      windowId: chrome.windows.WINDOW_ID_CURRENT
    chrome.tabs.query(queryInfo, callback)

  withCompleteTabs: (callback) ->
    queryInfo =
      status: "complete"
      windowId: chrome.windows.WINDOW_ID_CURRENT
    chrome.tabs.query(queryInfo, callback)

  listenUpdatedTabs: () ->
    chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
      console.log "Update: the url of tab #{tabId} changed to #{changeInfo.url}"




module.exports = ChromeInterop