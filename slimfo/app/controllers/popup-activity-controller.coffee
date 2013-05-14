PopupSiteController = require 'controllers/popup-site-controller'
PopupActivityView = require 'views/popup/activity-view'
NewPageVisitsView = require 'views/collections/new-page-visits-view'
NewPageVisits = require 'models/NewPageVisits'

module.exports = class PopupActivityController extends PopupSiteController
  show: ->
    @view = new PopupActivityView region: 'popup-main'

  newPageVisits: ->
    npv = new NewPageVisits
    npv.fetch()
    # console.log npv
    @view = new NewPageVisitsView(collection: npv, region: 'popup-main')

    
