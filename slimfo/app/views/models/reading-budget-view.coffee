View = require 'views/base/view'
template = require 'views/templates/models/reading-budget'

module.exports = class ReadingBudgetView extends View
  autoRender: true
  template: template
  tagname: 'div'

  render: ->
    super
