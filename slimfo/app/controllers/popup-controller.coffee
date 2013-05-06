Controller = require 'controllers/base/controller'
PopupView = require 'views/popup-view'

module.exports = class PopupController extends Controller
  index: ->
    @view = new PopupView region: 'main'
    @view.render()
