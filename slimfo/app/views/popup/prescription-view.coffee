View = require 'views/base/view'
template = require 'views/templates/popup/prescription'

module.exports = class PrescriptionView extends View
  className: 'popup-prescription'
  autoRender: true
  autoAttach: true
  template: template

  regions:
    '#greeting':  'greeting'
    '#doctor-prescription': 'doctor-prescription'
    '#prescription-list': 'prescription-list'