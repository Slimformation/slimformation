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
    Chaplin.mediator.subscribe 'slideStop', @updateOverallDistribution
    Chaplin.mediator.subscribe 'editGoals', @initializeOverallDistribution
    @checkIfReadingGoalsExist()

  initializeOverallDistribution: () ->
    actual = _.map($('.slider'), (slider) ->
      category: $(slider.lastChild).attr('data-slider-category')
      value: $(slider.lastChild).attr('data-slider-value')
    )
    values = _.pluck(actual, 'value')
    total = _.reduce(values, ((m,i) -> Number(m)+Number(i)), 0)
    actualWithPortions = _.map(actual, (i) ->
      category: i.category
      value: i.value
      portion: ((i.value/total)*100).toString()+"%"  
    )
    _.each($('#overall-distribution div'), (item) ->
      cat = $(item).attr('data-slider-category')
      newItem = _.find(actualWithPortions, (i) ->
        i.category == cat
      )
      $(item).css('width', newItem.portion)
    )
    
    

  updateOverallDistribution: (event) ->
    # extract target attrs
    target =
      category: $(event.currentTarget.lastChild).attr('data-slider-category')
      value: event.value

    
    # update distribution
    others = _.map($('.slider'), (slider) ->
      category: $(slider.lastChild).attr('data-slider-category')
      value: $(slider.lastChild).attr('data-slider-value')
    )

    # remove old value
    withoutTarget = _.filter(others, (item) ->
        item.category != target.category
      )

    # check if in DOM; if there, use it; if not, determine it & store it
    if window.actual is undefined
      actual = withoutTarget.concat([target])
      window.actual = actual
    else
      actualUpdate = _.filter(window.actual, (item) ->
        item.category != target.category
      )
      actual = actualUpdate.concat([target])
      window.actual = actual
      

    # calculate % of total (portions)
    values = _.pluck(actual, 'value')
    total = _.reduce(values, ((m,i) -> Number(m)+Number(i)), 0)
    actualWithPortions = _.map(actual, (i) ->
      category: i.category
      value: i.value
      portion: ((i.value/total)*100).toString()+"%"  
    )
    _.each($('#overall-distribution div'), (item) ->
      cat = $(item).attr('data-slider-category')
      newItem = _.find(actualWithPortions, (i) ->
        i.category == cat
      )
      $(item).css('width', newItem.portion)
    )
    
    

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
    

