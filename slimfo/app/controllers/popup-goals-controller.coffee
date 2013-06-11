PopupSiteController = require 'controllers/popup-site-controller'
PopupGoalsView = require 'views/popup/goals-view'
GoalsChartView = require 'views/charts/goals-chart-view'
UserReadingGoal = require 'models/UserReadingGoal'
UserReadingGoals = require 'models/UserReadingGoals'
ReadingBudget = require 'models/ReadingBudget'
ReadingBudgets = require 'models/ReadingBudgets'
ReadingBudgetsView = require 'views/collections/reading-budgets-view'
NewPageVisits = require 'models/NewPageVisits'
utils = require 'lib/utils'
UserReadingGoalsView = require 'views/collections/user-reading-goals-view'
Chaplin = require 'chaplin'

module.exports = class PopupGoalsController extends PopupSiteController

  initialize: ->
    super
    @checkIfReadingGoalsExist()
    Chaplin.mediator.subscribe 'user-reading-goals-empty', @createSliders
    Chaplin.mediator.subscribe 'slideStop', @updateSliderValue
    Chaplin.mediator.subscribe 'slideStop', @updateOverallDistribution
    Chaplin.mediator.subscribe 'editGoals', @initializeOverallDistribution
    Chaplin.mediator.subscribe 'init-reading-budgets', @initializeReadingBudgets

  # computes and stores reading budgets
  initializeReadingBudgets: () ->
    # compute the necessary maps...
    actualUsage = {}
    $.when(
      npv = new NewPageVisits
      npv = npv.fetch()
    ).then((npv) ->
      cat_read_map = utils.categoryReadingAmountMap(npv)
      actualUsage = utils.categoryReadingProportionsMap(cat_read_map)
    )
    projectedUsage = {}
    $.when(
      urg = new UserReadingGoals
      urg.fetch()
    ).then((urg) ->
      arrayOfPairs = _.map(urg.models, ((item) ->
        return [item.attributes.name, item.attributes.value]
        ))
      projectedUsage = _.object(arrayOfPairs)
    )
    
    # find or create everything in ReadingBudgets
    $.when(
      rbs = new ReadingBudgets
      rbs.fetch()
    ).then((rbs) ->
      _.each(projectedUsage, ((v, k) ->
        rb = rbs.findWhere({category: k})
        if _.isUndefined(rb)
          rbs.create
            created_at: utils.getCurrentTime()
            updated_at: utils.getCurrentTime()
            category: k
            value: actualUsage[k]
            actual: actualUsage[k]
            projected: v
        else
          rb.save
            updated_at: utils.getCurrentTime()
            value: actualUsage[k]
            actual: actualUsage[k]
            projected: v
      ))        
    )

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
    # make sure to refresh all reading budgets
    Chaplin.mediator.publish 'init-reading-budgets'
    
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
    

    rbs = new ReadingBudgets
    # override fetch() to compute the right stuff
    rbs.fetch()
    console.log rbs
    goalsChartView = new ReadingBudgetsView(collection: rbs, container: @el, region: 'goals-chart')
    

