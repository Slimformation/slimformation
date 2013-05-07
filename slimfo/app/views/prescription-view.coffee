View = require 'views/base/view'
template = require 'views/templates/prescription'

module.exports = class PrescriptionView extends View
  className: 'prescription'
  autoRender: true
  template: template

  initialize: ->
    super
    console.log 'ugh'
