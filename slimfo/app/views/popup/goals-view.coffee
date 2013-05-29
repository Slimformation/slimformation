View = require 'views/base/view'
template = require 'views/templates/popup/goals'

module.exports = class GoalsView extends View
  className: 'popup-goals'
  autoRender: true
  autoAttach: true
  template: template

  regions:
    '#goals-header-container': 'goals-header'
    '#goals-chart-container':  'goals-chart'
