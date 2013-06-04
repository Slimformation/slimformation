View = require 'views/base/view'
template = require 'views/templates/models/user-reading-goal'

module.exports = class UserReadingGoalView extends View
  autoRender: true
  template: template
  tagname: 'div'

  render: ->
    super
