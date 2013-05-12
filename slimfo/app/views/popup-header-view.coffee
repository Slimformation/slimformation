View = require 'views/base/view'
Chaplin = require 'chaplin'

template = require 'views/templates/popup-header'

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
    Chaplin.mediator.publish 'activity_tab'

  renderGoalsTab: ->
    Chaplin.mediator.publish 'goals_tab'

  renderPrescriptionTab: ->
    Chaplin.mediator.publish 'prescription_tab'
