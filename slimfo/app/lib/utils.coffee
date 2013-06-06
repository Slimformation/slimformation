Chaplin = require 'chaplin'

# Application-specific utilities
# ------------------------------

# Delegate to Chaplin’s utils module
utils = Chaplin.utils.beget Chaplin.utils

_(utils).extend
  removeProtocol: (url) ->
    url.replace(/.*?:\/\//g, "")

  validListenUrl: (url) ->
    falseConditions = [
      /^chrome/i.test(url),
      /www.google.com\/search/i.test(url)
    ]
    testAll = _.reduce(falseConditions, ((element, memo) ->
      memo = memo || element
    ), false, this)
    return !testAll

  elapsedTimeInSec: (tsec1, tsec2) ->
    Math.abs(tsec1 - tsec2)

  elapsedTimeInMin: (tsec1, tsec2) ->
    Math.abs((tsec2 - tsec1)/60)

  capitalizeFirstLetter: (word) ->
    word.charAt(0).toUpperCase() + word.slice(1)
 
  detailedTime: (numSeconds) ->
    sec = numSeconds % 60
    diff = numSeconds-sec
    min = Math.round(Math.abs(diff/60) % 60)
    diffDiff = diff - min*60
    hr = Math.round(Math.abs(diffDiff/3600) % 60)
    {
      hours: Number(hr)
      minutes: Number(min)
      seconds: Number(sec)
    }

  # takes a detailed time object object, returns a descriptive string
  humanizeTime: (detTimeObj) ->
    out = ""
    if Number(detTimeObj.hours) != 0
      out += detTimeObj.hours.toString() + " h"
    if Number(detTimeObj.minutes) != 0
      out += " " + detTimeObj.minutes.toString() + " m"
    if Number(detTimeObj.seconds) != 0
      out += " " + detTimeObj.seconds.toString() + " s"
    if out is ""
      out = "none"
    return out

module.exports = utils
