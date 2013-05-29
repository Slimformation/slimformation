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
      # now visible sliders, so display crap
      $('.slider-inner').slider(
        min: 0
        max: 100
        step: 1
        orientation: 'horizontal'
        value: 40
        handle: 'round'
        tooltip: 'hide'
      )
    if $('#goals-form-container').css('display') == "none"
      $('#edit-goals').text('Edit Goals')

  regions:
    '#goals-header-container': 'goals-header'
    '#goals-chart-container':  'goals-chart'
