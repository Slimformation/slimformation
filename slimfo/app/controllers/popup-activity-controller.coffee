PopupSiteController = require 'controllers/popup-site-controller'
PopupActivityView = require 'views/popup/activity-view'
NewPageVisitsView = require 'views/collections/new-page-visits-view'
ActivityChartView = require 'views/charts/activity-chart-view'
NewPageVisits = require 'models/NewPageVisits'

module.exports = class PopupActivityController extends PopupSiteController
  show: ->
    @view = new PopupActivityView region: 'popup-main'
    # other views, using region setup in the main view
    activityChartView = new ActivityChartView(autoRender: true, container: @el, region: 'activity-chart')
    activityChartView.initChart()
    npv = new NewPageVisits
    npv.fetch()
    newPageVisitsView = new NewPageVisitsView(collection: npv, region: 'recent-page-visits')
    

  # newPageVisits: ->
  #   npv = new NewPageVisits
  #   npv.fetch()
  #   # console.log npv

  #   @view = new NewPageVisitsView(collection: npv, region: 'popup-main')

    
