Controller = require 'controllers/base/controller'
PopupView = require 'views/popup-view'
Chrome = require 'lib/chrome-interop'

module.exports = class PopupController extends Controller
  index: ->
    @view = new PopupView region: 'main'
    Chrome.withCompleteTabs (tabs) ->
      console.log _.last(tabs).url

