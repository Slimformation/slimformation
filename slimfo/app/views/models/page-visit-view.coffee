View = require 'views/base/view'
template = require 'views/templates/models/page-visit'

module.exports = class PageVisitView extends View
  autoRender: true
  template: template
  tagname: 'div'

  render: ->
    super
