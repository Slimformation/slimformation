View = require 'views/base/view'
template = require 'views/templates/popup'

module.exports = class PopupView extends View
  className: 'popup'
  autoRender: true
  template: template
