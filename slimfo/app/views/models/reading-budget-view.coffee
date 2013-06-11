View = require 'views/base/view'
template = require 'views/templates/models/reading-budget'
Chaplin = require 'chaplin'

module.exports = class ReadingBudgetView extends View
  autoRender: true
  template: template
  tagname: 'div'

  initialize: ->
    super
    Chaplin.mediator.subscribe('readingBudgetChange', ((rb)->
        @replaceModel(rb)
        @render()
      ), @)

  replaceModel: (rb) ->
    if rb.attributes.category == @model.attributes.category
      @model = rb

  render: ->
    super
