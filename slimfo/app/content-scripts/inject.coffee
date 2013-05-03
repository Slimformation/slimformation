chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  console.log ((if sender.tab then "from a content script:" + sender.tab.url else "from the extension"))
  sendResponse farewell: "goodbye"  if request.greeting is "hello"