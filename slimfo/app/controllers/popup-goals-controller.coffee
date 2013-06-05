PopupSiteController = require 'controllers/popup-site-controller'
PopupGoalsView = require 'views/popup/goals-view'
GoalsChartView = require 'views/charts/goals-chart-view'
UserReadingGoal = require 'models/UserReadingGoal'
UserReadingGoals = require 'models/UserReadingGoals'
UserReadingGoalsView = require 'views/collections/user-reading-goals-view'
Chaplin = require 'chaplin'

module.exports = class PopupGoalsController extends PopupSiteController

  initialize: ->
    super
    Chaplin.mediator.subscribe 'user-reading-goals-empty', @createSliders
    Chaplin.mediator.subscribe 'slideStop', @updateSliderValue
    @checkIfReadingGoalsExist()

  updateSliderValue: (event) ->
    # extract category
    cat = $(event.currentTarget.lastChild).attr('data-slider-category')
    $.when(
      # fetch all reading goals
      urg = new UserReadingGoals
      urg.fetch()
    ).then((urg) ->
      # find model to update
      readingGoal = urg.findWhere(
        name: cat
      )
    ).then((readingGoal) ->
      # update model's value
      readingGoal.save
        value: event.value
    )

  checkIfReadingGoalsExist: ->
    urg = new UserReadingGoals
    urg.fetch()

    # check if user's budgets are defined, otherwise publish an event
    if urg.length < 6
      Chaplin.mediator.publish 'user-reading-goals-empty'

  createSliders: ->
    urg = new UserReadingGoals
    cats = ["politics","business","technology","sports","science","entertainment"]
    _.map(cats, ((cat) ->
      urg.create(name: cat, value: 50)
    ))


  show: ->
    @view = new PopupGoalsView region: 'popup-main'
    categories = ['Politics', 'Business', 'Technology', 'Sports', 'Science', 'Entertainment', 'Other']


    # instantiate the sliders view with fetched user reading goals
    $.when(
      urg = new UserReadingGoals
      urg.fetch()
    ).then((urg) ->
      goalsSlidersView = new UserReadingGoalsView(
        collection: urg
        region: 'goals-sliders'
      )
    ).then((goalsSlidersView) ->
      goalsSlidersView.initSliders()
    )
    
    
    goalsChartView = new GoalsChartView(autoRender: true, container: @el, region: 'goals-chart')
    goalsChartView.initChart()
    

