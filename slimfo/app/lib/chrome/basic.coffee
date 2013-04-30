# chrome extension stuff here...

class BasicChrome
  withActiveTabs: (callback) ->
    queryInfo =
      active: true
    chrome.tabs.query queryInfo, callback

module.exports = BasicChrome