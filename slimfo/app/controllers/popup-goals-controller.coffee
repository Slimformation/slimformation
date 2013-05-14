PopupSiteController = require 'controllers/popup-site-controller'
PopupGoalsView = require 'views/popup/goals-view'

module.exports = class PopupGoalsController extends PopupSiteController

  show: ->
    @view = new PopupGoalsView region: 'popup-main'
