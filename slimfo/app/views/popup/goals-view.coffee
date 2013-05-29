View = require 'views/base/view'
template = require 'views/templates/popup/goals'

module.exports = class GoalsView extends View
  className: 'popup-goals'
  autoRender: true
  autoAttach: true
  template: template

  initialize: ->
    @delegate 'click', '#edit-goals', @showForm

  showForm: ->
    $('#goals-chart-container').toggle()
    $('#goals-form-container').toggle()
    if $('#goals-form-container').css('display') == "block"
      $('#edit-goals').text('Save Goals')
    if $('#goals-form-container').css('display') == "none"
      $('#edit-goals').text('Edit Goals')

  showChart: -> 
    $('#goals-chart-container').toggle()
    $('#goals-form-contrainer').toggle()

  regions:
    '#goals-header-container': 'goals-header'
    '#goals-chart-container':  'goals-chart'
