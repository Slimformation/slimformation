View = require 'views/base/view'
template = require 'views/templates/popup/prescription'
Chaplin = require 'chaplin'

module.exports = class PrescriptionView extends View
  className: 'popup-prescription'
  autoRender: true
  autoAttach: true
  template: template

  regions:
    '#greeting':  'greeting'
    '#prescription-header': 'prescription-header'
    '#prescription-list': 'prescription-list'

  initialize: ->
    super
    @delegate('click', '#politics', @renderPoliticsTab)
    @delegate('click', '#business', @renderBusinessTab)
    @delegate('click', '#technology', @renderTechnologyTab)
    @delegate('click', '#sports', @renderSportsTab)
    @delegate('click', '#science', @renderScienceTab)
    @delegate('click', '#entertainment', @renderEntertainmentTab)

  renderPoliticsTab: ->
    $('.btn.btn-primary.active').attr('class','btn btn-primary')
    $('#politics').attr('class','btn btn-primary active')

  renderBusinessTab: ->
    $('.btn.btn-primary.active').attr('class','btn btn-primary')
    $('#business').attr('class','btn btn-primary active')

  renderTechnologyTab: ->
    $('.btn.btn-primary.active').attr('class','btn btn-primary')
    $('#technology').attr('class','btn btn-primary active')

  renderSportsTab: ->
    $('.btn.btn-primary.active').attr('class','btn btn-primary')
    $('#sports').attr('class','btn btn-primary active')

  renderScienceTab: ->
    $('.btn.btn-primary.active').attr('class','btn btn-primary')
    $('#science').attr('class','btn btn-primary active')

  renderEntertainmentTab: ->
    $('.btn.btn-primary.active').attr('class','btn btn-primary')
    $('#entertainment').attr('class','btn btn-primary active')
