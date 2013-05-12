View = require 'views/base/view'
template = require 'views/templates/popup-footer'

module.exports = class PopupFooterView extends View
  template: template
  autoRender: true
  className: 'popup-footer'
  id: 'popup-footer'
