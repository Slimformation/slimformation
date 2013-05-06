View = require 'views/base/view'
template = require 'views/templates/popup'

module.exports = class PopupView extends View
  className: 'popup'
  template: template

  # initialize: ->
  #   this.listenTo(this.model, 'change', this.render)

  render: ->
    @template()
