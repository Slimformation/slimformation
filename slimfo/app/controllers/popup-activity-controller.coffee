PopupSiteController = require 'controllers/popup-site-controller'
PopupActivityView = require 'views/popup/activity-view'
NewPageVisitsView = require 'views/collections/new-page-visits-view'
ActivityChartView = require 'views/charts/activity-chart-view'
NewPageVisits = require 'models/NewPageVisits'
ActivityTableView = require 'views/collections/category-source-table-view'
WelcomeView = require 'views/popup/welcome-view'
model = require 'models/base/model'
config = require 'config'
nuh = require 'lib/new-user-helper'

module.exports = class PopupActivityController extends PopupSiteController
  show: ->
    # main view, which sets up regions for other views
    @view = new PopupActivityView region: 'popup-main'
    
    if nuh.isNewUser()
      @welcomeView = new WelcomeView region: 'welcome'
    else
      # fetch all new page visits
      npv = new NewPageVisits
      npv.fetch()

      # other views, using region setup in the main view

      @activityChartView = new ActivityChartView collection: npv, region: 'activity-chart'
      @activityChartView.initChart()
      

      @activityTableView = new ActivityTableView collection: npv, region: 'source-page-visits'
      @activityTableView.initTable()
