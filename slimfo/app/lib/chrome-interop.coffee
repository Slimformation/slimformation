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

module.exports = ChromeInterop