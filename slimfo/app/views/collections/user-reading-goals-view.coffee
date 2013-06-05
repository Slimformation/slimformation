CollectionView = require 'views/base/collection-view'
template = require 'views/templates/collections/user-reading-goals'
UserReadingGoalView = require 'views/models/user-reading-goal-view'
Chaplin = require 'chaplin'

module.exports = class UserReadingGoalsView extends CollectionView
  autoRender: true
  autoAttach: true
  template: template
  itemView: UserReadingGoalView
  listSelector: '#user-reading-goals'

  initSliders: ->
    # actually initialize the sliders
    $('.indiv-slider > input').slider()
    # publish slideStop events
    $('.slider').on('slideStop', (event) ->
      Chaplin.mediator.publish "slideStop", event
    )
    # publish sliding events
    $('.slider').on('slide', (event) ->
      Chaplin.mediator.publish "slide", event
    )
