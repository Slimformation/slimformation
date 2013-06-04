PopupSiteController = require 'controllers/popup-site-controller'
PopupGoalsView = require 'views/popup/goals-view'
GoalsChartView = require 'views/charts/goals-chart-view'
UserReadingGoals = require 'models/UserReadingGoals'
Chaplin = require 'chaplin'

module.exports = class PopupGoalsController extends PopupSiteController

  show: ->
    @view = new PopupGoalsView region: 'popup-main'
    categories = ['Politics', 'Business', 'Technology', 'Sports', 'Science', 'Entertainment', 'Other']

    # check if user's budgets are defined, otherwise publish an event
    urg = new UserReadingGoals
    urg.fetch()
    if urg.length == 0
      Chaplin.mediator.publish 'user-reading-goals-empty'
      
    goalsChartView = new GoalsChartView(autoRender: true, container: @el, region: 'goals-chart')
    goalsChartView.initChart()
    

