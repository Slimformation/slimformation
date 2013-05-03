# message listening example, for one-off messages
# chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
#   console.log ((if sender.tab then "from a content script:" + sender.tab.url else "from the extension"))
#   sendResponse farewell: "goodbye"  if request.greeting is "hello"

# register a chrome.runtime.Port
ActivityPort = chrome.runtime.connect {name: "activity"}

# given a certain ID, set an interval to measure activity
measureActivity = () ->
  setInterval((->
    ActivityPort.postMessage
      type: "update"
      timestamp: (new Date()).getTime()
      pageVisitUrl: window.location.href
  ), 1000)

ActivityPort.onMessage.addListener (msg) ->
  console.log msg
  switch msg.type
    when "initialize"
      measureActivity()
