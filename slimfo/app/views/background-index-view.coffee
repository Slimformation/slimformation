View = require 'views/base/view'
template = require 'views/templates/background-index'

module.exports = class BackgroundIndexView extends View
  template: template
  autoRender: true