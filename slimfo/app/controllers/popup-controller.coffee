Controller = require 'controllers/base/controller'
PopupView = require 'views/popup-view'
BasicChrome = require 'lib/chrome/basic'

module.exports = class PopupController extends Controller
  index: ->
    @view = new PopupView region: 'main'
    (new BasicChrome).withActiveTabs (tabs) ->
      console.log tabs[0].url

