View = require 'views/base/view'
template = require 'views/templates/popup/goals'
Chaplin = require 'chaplin'

module.exports = class GoalsView extends View
  className: 'popup-goals'
  autoRender: true
  autoAttach: true
  template: template

  initialize: ->
    @delegate 'click', '#edit-goals', (-> Chaplin.mediator.publish "editGoals")
    Chaplin.mediator.subscribe "editGoals", @showForm


  showForm: ->
    $('#goals-chart-container').toggle()
    $('#goals-sliders-container').toggle()
    if $('#goals-sliders-container').css('display') == "block"
      $('#edit-goals').text('Save Goals')
    if $('#goals-sliders-container').css('display') == "none"
      $('#edit-goals').text('Edit Goals')

  regions:
    '#goals-header-container': 'goals-header'
    '#goals-chart-container':  'goals-chart'
    '#goals-sliders-container': 'goals-sliders'
