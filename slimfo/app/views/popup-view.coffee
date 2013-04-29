View = require 'views/base/view'
template = require 'views/templates/popup'

module.exports = class PopupView extends View
  autoRender: true
  className: 'popup'
  template: template
