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
    @delegate('click', '#politics', (->
        @renderTab('politics')
        Chaplin.mediator.publish 'new_prescription_tab', 'politics'
        ))
    @delegate('click', '#business', (->
        @renderTab('business')
        Chaplin.mediator.publish 'new_prescription_tab', 'business'
        ))
    @delegate('click', '#technology', (->
        @renderTab('technology')
        Chaplin.mediator.publish 'new_prescription_tab', 'technology'
        ))
    @delegate('click', '#sports', (->
        @renderTab('sports')
        Chaplin.mediator.publish 'new_prescription_tab', 'sports'
        ))
    @delegate('click', '#science', (->
        @renderTab('science')
        Chaplin.mediator.publish 'new_prescription_tab', 'science'
        ))
    @delegate('click', '#entertainment', (->
        @renderTab('entertainment')
        Chaplin.mediator.publish 'new_prescription_tab', 'entertainment'
        ))

  renderTab: (cat) ->
    if /politics/.test(cat)
        @renderPoliticsTab()
    if /business/.test(cat)
        @renderBusinessTab()
    if /technology/.test(cat)
        @renderTechnologyTab()
    if /sports/.test(cat)
        @renderSportsTab()
    if /science/.test(cat)
        @renderScienceTab()
    if /entertainment/.test(cat)
        @renderEntertainmentTab()

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
