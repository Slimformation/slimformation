View = require 'views/base/view'
template = require 'views/templates/popup/goals'
Chaplin = require 'chaplin'

module.exports = class GoalsView extends View
  className: 'popup-goals'
  autoRender: true
  autoAttach: true
  template: template

  initialize: ->
    super
    @delegate 'click', '#edit-goals', (->
      if /Edit Goals/.test($('#edit-goals').text())
        Chaplin.mediator.publish("editGoals")
        @showForm()
      else
        Chaplin.mediator.publish("saveGoals")
        @showForm()
    )
    

  showForm: ->
    $('#reading-budgets-container').toggle()
    $('#goals-sliders-container').toggle()
    if $('#goals-sliders-container').css('display') == "block"
      $('#edit-goals').text('Save Goals')
    if $('#goals-sliders-container').css('display') == "none"
      $('#edit-goals').text('Edit Goals')

  regions:
    '#goals-header-container': 'goals-header'
    #'#goals-chart-container':  'goals-chart'
    '#reading-budgets-container': 'goals-reading-budgets'
    '#goals-sliders-container': 'goals-sliders'
