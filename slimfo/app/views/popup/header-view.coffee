View = require 'views/base/view'
Chaplin = require 'chaplin'

template = require 'views/templates/popup/header'

module.exports = class HeaderView extends View
  autoRender: yes
  className: 'popup-header'
  id: 'popup-header'
  template: template

  initialize: ->
    super
    @delegate('click', '.activity', @renderActivityTab)
    @delegate('click', '.goals', @renderGoalsTab)
    @delegate('click', '.prescription', @renderPrescriptionTab)

  renderActivityTab: ->
    $('#active').attr('id','')
    $('li.activity').attr('id','active')
    Chaplin.mediator.publish 'activity_tab'

  renderGoalsTab: ->
    $('#active').attr('id','')
    $('li.goals').attr('id','active')
    Chaplin.mediator.publish 'goals_tab'

  renderPrescriptionTab: ->
    $('#active').attr('id','')
    $('li.prescription').attr('id','active')
    Chaplin.mediator.publish 'prescription_tab'
