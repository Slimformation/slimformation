Chaplin = require 'chaplin'
View = require 'views/base/view'
template = require 'views/templates/popup/activity'

module.exports = class ActivityView extends View
  className: 'popup-activity'
  autoRender: true
  autoAttach: true
  template: template

  regions:
    '#activity-chart-container':  'activity-chart'
    '#recent-page-visits': 'recent-page-visits'
    '#source-page-visits': 'source-page-visits'

  # initialize: ->
  #   super

  # render: ->
  #   super
    # activityChart = new ActivityChartView autoRender: true, container: @el, region: 'activity-chart'
    # @subview 'activityChart', activityChart

  # renderNewPageVisits: ->
  #   Chaplin.mediator.publish 'display:NewPageVisits'
