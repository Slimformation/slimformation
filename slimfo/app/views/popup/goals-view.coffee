View = require 'views/base/view'
template = require 'views/templates/popup/goals'

module.exports = class GoalsView extends View
  className: 'popup-goals'
  autoRender: true
  template: template

  regions:
    '#goals-chart-container':  'goals-chart'
