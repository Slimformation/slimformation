PopupSiteController = require 'controllers/popup-site-controller'
PopupGoalsView = require 'views/popup/goals-view'
GoalsChartView = require 'views/charts/goals-chart-view'

module.exports = class PopupGoalsController extends PopupSiteController

  show: ->
    @view = new PopupGoalsView region: 'popup-main'
    goalsChartView = new GoalsChartView(autoRender: true, container: @el, region: 'goals-chart')
    goalsChartView.initChart()
