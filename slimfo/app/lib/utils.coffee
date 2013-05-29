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
   !testAll

module.exports = utils
