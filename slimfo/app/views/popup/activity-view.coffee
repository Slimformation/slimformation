View = require 'views/base/view'
template = require 'views/templates/popup/activity'

module.exports = class ActivityView extends View
  className: 'popup-activity'
  autoRender: true
  template: template