PopupSiteController = require 'controllers/popup-site-controller'
PopupActivityView = require 'views/popup/activity-view'

module.exports = class PopupActivityController extends PopupSiteController
  
  show: ->
    @view = new PopupActivityView region: 'popup-main'
