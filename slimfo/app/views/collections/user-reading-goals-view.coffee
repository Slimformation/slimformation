CollectionView = require 'views/base/collection-view'
template = require 'views/templates/collections/user-reading-goals'
UserReadingGoalView = require 'views/models/user-reading-goal-view'

module.exports = class UserReadingGoalsView extends CollectionView
  autoRender: true
  autoAttach: true
  template: template
  itemView: UserReadingGoalView
  listSelector: '#user-reading-goals'

  initSliders: ->
    # actually initialize the sliders
    $('.indiv-slider > input').slider()
