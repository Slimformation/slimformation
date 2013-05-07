View = require 'views/base/view'
template = require 'views/templates/goals'

module.exports = class GoalsView extends View
  className: 'goals'
  autoRender: true
  template: template
